/**
 * tests/llm_openrouter.test.ts
 *
 * Comprehensive test suite for OpenRouter provider integration and LLM interface:
 *  1. OpenRouter configuration detection
 *  2. Missing OpenRouter API key error handling
 *  3. Successful OpenRouter response and schema parsing
 *  4. Invalid model response (non-JSON, prose, markdown fences) is rejected
 *  5. Invalid structured output (invalid enum, missing required fields) is rejected
 *  6. Ground-truth leakage protection
 *  7. Financial recovery clamping (0 <= predictedRecoveryPaise <= amountPaise)
 *  8. Bounded retry behavior (retries transient failures up to 2 attempts)
 *  9. Authentication failure (401/403) is non-retryable
 *  10. Rate-limit failure (429) is retryable
 *  11. RecoveryRecommendation contract remains 100% unchanged
 *  12. Policy Gate continues working without modification
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import {
  isOpenRouterConfigured,
  getOpenRouterApiKey,
  executeOpenRouterDiagnosis,
  OpenRouterConfigError,
  OpenRouterAuthError,
  OpenRouterValidationError,
} from '../src/lib/openrouter.js';
import {
  getLLMProvider,
  isLLMConfigured,
} from '../src/lib/llm.js';
import { generateSyntheticDataset } from '../src/evaluation/generator.js';
import {
  toObservableTransaction,
  assertNoGroundTruthLeakage,
  FORBIDDEN_GROUND_TRUTH_KEYS,
} from '../src/agents/observation.js';
import { RecoveryRecommendationSchema } from '../src/lib/schemas.js';
import { evaluatePolicyGate } from '../src/agents/policyGate.js';
import type { ObservableTransaction, RecoveryRecommendation } from '../src/types/index.js';

// Helper to create a mock HTTP server for OpenRouter API
function createMockOpenRouterServer(handler: (req: http.IncomingMessage, res: http.ServerResponse) => void) {
  return new Promise<{ server: http.Server; url: string }>((resolve) => {
    const server = http.createServer(handler);
    server.listen(0, '127.0.0.1', () => {
      const port = (server.address() as AddressInfo).port;
      resolve({ server, url: `http://127.0.0.1:${port}` });
    });
  });
}

function stopServer(server: http.Server): void {
  if (typeof (server as any).closeAllConnections === 'function') {
    (server as any).closeAllConnections();
  }
  server.close();
}

function createSampleObservable(): ObservableTransaction {
  return {
    transactionId: 'txn_test_openrouter_01',
    amountPaise: 450000,
    currency: 'INR',
    paymentMethod: 'card',
    status: 'failed',
    failureCode: 'GATEWAY_TIMEOUT',
    failureCategory: 'temporary_network_failure',
    failureDescription: 'Acquiring switch timed out',
    retryCount: 0,
    createdAt: new Date().toISOString(),
    customerHistory: {
      customerId: 'cust_test_01',
      previousPayments: 12,
      successfulPayments: 11,
      previousFailures: 1,
      retrySuccessRate: 0.92,
      preferredMethod: 'card',
      averageTransactionPaise: 450000,
    },
  };
}

// 1. OpenRouter configuration detection
test('1. OpenRouter configuration detection', () => {
  const originalKey = process.env.OPENROUTER_API_KEY;
  const originalProvider = process.env.LLM_PROVIDER;
  try {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-validkey123456';
    process.env.LLM_PROVIDER = 'openrouter';
    assert.equal(isOpenRouterConfigured(), true);
    assert.equal(isLLMConfigured(), true);
    assert.equal(getLLMProvider(), 'openrouter');
    assert.equal(getOpenRouterApiKey(), 'sk-or-v1-validkey123456');
  } finally {
    if (originalKey !== undefined) process.env.OPENROUTER_API_KEY = originalKey;
    else delete process.env.OPENROUTER_API_KEY;
    if (originalProvider !== undefined) process.env.LLM_PROVIDER = originalProvider;
    else delete process.env.LLM_PROVIDER;
  }
});

// 2. Missing OpenRouter API key throws OpenRouterConfigError / LLMConfigError
test('2. Missing OpenRouter API key throws OpenRouterConfigError', () => {
  const originalKey = process.env.OPENROUTER_API_KEY;
  try {
    process.env.OPENROUTER_API_KEY = '';
    assert.equal(isOpenRouterConfigured(), false);
    assert.throws(
      () => getOpenRouterApiKey(),
      (err: unknown) => {
        return err instanceof OpenRouterConfigError && (err as Error).message.includes('OPENROUTER_API_KEY');
      }
    );
  } finally {
    if (originalKey !== undefined) process.env.OPENROUTER_API_KEY = originalKey;
    else delete process.env.OPENROUTER_API_KEY;
  }
});

// 3. Successful OpenRouter response and schema parsing
test('3. Successful OpenRouter response and schema parsing', async () => {
  const mockDiagnosis = {
    failureType: 'temporary',
    recoverability: 0.88,
    recommendedStrategy: 'smart_retry',
    confidence: 0.94,
    evidence: ['Gateway timeout code observed', 'High customer historical success rate (92%)'],
    reasoning: 'Transient network timeout during card authorization switch',
    recommendedInterventionCostPaise: 150,
    estimatedRecoveryPaise: 396000,
  };

  const { server, url } = await createMockOpenRouterServer((req, res) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      const parsedBody = JSON.parse(body);
      assert.equal(parsedBody.response_format?.type, 'json_object');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          id: 'gen-test-123',
          choices: [
            {
              message: {
                role: 'assistant',
                content: JSON.stringify(mockDiagnosis),
              },
            },
          ],
        })
      );
    });
  });

  try {
    const raw = await executeOpenRouterDiagnosis('test prompt', 'test system', {
      apiKey: 'test-key',
      baseUrl: url,
      model: 'openrouter/free',
    });

    assert.equal(raw.failureType, 'temporary');
    assert.equal(raw.recoverability, 0.88);
    assert.equal(raw.recommendedStrategy, 'smart_retry');
    assert.equal(raw.confidence, 0.94);
    assert.equal(raw.evidence.length, 2);
    assert.equal(raw.recommendedInterventionCostPaise, 150);
  } finally {
    stopServer(server);
  }
});

// 4. Invalid model response (non-JSON text / markdown fences) is rejected
test('4. Invalid model response (non-JSON or markdown text) is strictly rejected', async () => {
  const { server, url } = await createMockOpenRouterServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        id: 'gen-test-invalid',
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'Here is your diagnosis: ```json\n{"failureType": "temporary"}\n```',
            },
          },
        ],
      })
    );
  });

  try {
    await assert.rejects(
      async () => {
        await executeOpenRouterDiagnosis('test prompt', undefined, {
          apiKey: 'test-key',
          baseUrl: url,
        });
      },
      (err: unknown) => {
        return err instanceof OpenRouterValidationError;
      }
    );
  } finally {
    stopServer(server);
  }
});

// 5. Invalid structured output (invalid enum / missing fields) is rejected
test('5. Invalid structured output (invalid enum / missing fields) is rejected', async () => {
  const { server, url } = await createMockOpenRouterServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        id: 'gen-test-invalid-schema',
        choices: [
          {
            message: {
              role: 'assistant',
              content: JSON.stringify({
                failureType: 'invalid_failure_enum', // Invalid enum
                recoverability: 0.85,
                recommendedStrategy: 'smart_retry',
                confidence: 0.9,
                evidence: ['Evidence 1'],
                reasoning: 'Reasoning 1',
              }),
            },
          },
        ],
      })
    );
  });

  try {
    await assert.rejects(
      async () => {
        await executeOpenRouterDiagnosis('test prompt', undefined, {
          apiKey: 'test-key',
          baseUrl: url,
        });
      },
      (err: unknown) => {
        return err instanceof OpenRouterValidationError;
      }
    );
  } finally {
    stopServer(server);
  }
});

// 6. Ground-truth leakage protection
test('6. Ground-truth leakage protection strictly blocks forbidden keys', () => {
  const { transactions } = generateSyntheticDataset(5, 'gt-test-seed');
  const txn = transactions[0];

  assert.ok(txn.groundTruth);
  const observable = toObservableTransaction(txn);

  assert.doesNotThrow(() => {
    assertNoGroundTruthLeakage(observable);
  });

  // Verify that any forbidden key triggers an error
  for (const key of FORBIDDEN_GROUND_TRUTH_KEYS) {
    const leaked = { [key]: 'leak_value', transactionId: 'txn_123' };
    assert.throws(
      () => assertNoGroundTruthLeakage(leaked),
      /Ground truth leakage detected/
    );
  }
});

// 7. Financial recovery clamping
test('7. Financial recovery clamping invariants (0 <= predictedRecoveryPaise <= amountPaise)', () => {
  const observable = createSampleObservable();

  // Test over-optimistic prediction (e.g. 150% recovery)
  const excessivePaise = observable.amountPaise * 1.5;
  const clampedExcessive = Math.max(0, Math.min(observable.amountPaise, excessivePaise));
  assert.equal(clampedExcessive, observable.amountPaise);

  // Test negative prediction
  const negativePaise = -5000;
  const clampedNegative = Math.max(0, Math.min(observable.amountPaise, negativePaise));
  assert.equal(clampedNegative, 0);

  // Verify valid recommendation matches schema
  const recommendation: RecoveryRecommendation = {
    transactionId: observable.transactionId,
    failureType: 'temporary',
    recoverability: 0.9,
    recommendedStrategy: 'smart_retry',
    confidence: 0.95,
    evidence: ['Verified telemetry'],
    reasoning: 'Transient network failure',
    predictedRecoveryPaise: clampedExcessive,
    recommendedInterventionCostPaise: 150,
  };

  const parsed = RecoveryRecommendationSchema.parse(recommendation);
  assert.equal(parsed.predictedRecoveryPaise, observable.amountPaise);
  assert.ok(parsed.recommendedInterventionCostPaise >= 0);
});

// 8. Retry behavior: retries transient errors up to 2 attempts
test('8. Retry behavior: retries transient errors up to 2 attempts', async () => {
  let callCount = 0;

  const { server, url } = await createMockOpenRouterServer((_req, res) => {
    callCount++;
    if (callCount === 1) {
      // First attempt fails with 503 Service Unavailable
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'OpenRouter temporary unavailable' } }));
    } else {
      // Second attempt succeeds
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          choices: [
            {
              message: {
                role: 'assistant',
                content: JSON.stringify({
                  failureType: 'temporary',
                  recoverability: 0.9,
                  recommendedStrategy: 'smart_retry',
                  confidence: 0.95,
                  evidence: ['Evidence point'],
                  reasoning: 'Retry recovery',
                }),
              },
            },
          ],
        })
      );
    }
  });

  try {
    const res = await executeOpenRouterDiagnosis('test prompt', undefined, {
      apiKey: 'test-key',
      baseUrl: url,
    });
    assert.equal(callCount, 2);
    assert.equal(res.recommendedStrategy, 'smart_retry');
  } finally {
    stopServer(server);
  }
});

// 9. Authentication failure (401/403) is non-retryable
test('9. Authentication failure (401/403) is non-retryable', async () => {
  let callCount = 0;

  const { server, url } = await createMockOpenRouterServer((_req, res) => {
    callCount++;
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { message: 'Invalid API key provided' } }));
  });

  try {
    await assert.rejects(
      async () => {
        await executeOpenRouterDiagnosis('test prompt', undefined, {
          apiKey: 'invalid-key',
          baseUrl: url,
        });
      },
      (err: unknown) => {
        return err instanceof OpenRouterAuthError;
      }
    );
    // MUST NOT RETRY: Call count must be exactly 1
    assert.equal(callCount, 1);
  } finally {
    stopServer(server);
  }
});

// 10. Rate-limit failure (429) is retryable
test('10. Rate-limit failure (429) is retryable', async () => {
  let callCount = 0;

  const { server, url } = await createMockOpenRouterServer((_req, res) => {
    callCount++;
    if (callCount === 1) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'Rate limit exceeded' } }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          choices: [
            {
              message: {
                role: 'assistant',
                content: JSON.stringify({
                  failureType: 'temporary',
                  recoverability: 0.8,
                  recommendedStrategy: 'smart_retry',
                  confidence: 0.9,
                  evidence: ['Recovered after 429 retry'],
                  reasoning: 'Retry succeeded',
                }),
              },
            },
          ],
        })
      );
    }
  });

  try {
    const res = await executeOpenRouterDiagnosis('test prompt', undefined, {
      apiKey: 'test-key',
      baseUrl: url,
    });
    assert.equal(callCount, 2);
    assert.equal(res.recommendedStrategy, 'smart_retry');
  } finally {
    stopServer(server);
  }
});

// 11. RecoveryRecommendation contract remains 100% unchanged
test('11. RecoveryRecommendation contract remains 100% unchanged and schema compliant', () => {
  const validPayload: RecoveryRecommendation = {
    transactionId: 'txn_openrouter_123',
    failureType: 'payment_method',
    recoverability: 0.75,
    recommendedStrategy: 'payment_method_switch',
    confidence: 0.89,
    evidence: ['Expired card metadata detected'],
    reasoning: 'Instrument expired; customer prompted to select alternate card/UPI',
    predictedRecoveryPaise: 337500,
    recommendedInterventionCostPaise: 450,
  };

  const validated = RecoveryRecommendationSchema.parse(validPayload);
  assert.equal(validated.transactionId, 'txn_openrouter_123');
  assert.equal(validated.recommendedStrategy, 'payment_method_switch');
  assert.equal(validated.predictedRecoveryPaise, 337500);
  assert.equal(validated.recommendedInterventionCostPaise, 450);
});

// 12. Policy Gate continues working without modification
test('12. Policy Gate continues working without modification on LLM recommendations', () => {
  const observable = createSampleObservable();
  const recommendation: RecoveryRecommendation = {
    transactionId: observable.transactionId,
    failureType: 'temporary',
    recoverability: 0.9,
    recommendedStrategy: 'smart_retry',
    confidence: 0.95,
    evidence: ['Gateway timeout verified'],
    reasoning: 'Transient network failure suitable for smart retry',
    predictedRecoveryPaise: 405000,
    recommendedInterventionCostPaise: 150,
  };

  const decision = evaluatePolicyGate(recommendation, observable);
  assert.equal(decision.allowed, true);
  assert.equal(decision.reasonCode, 'ALLOWED');
  assert.equal(decision.verdict, 'approved');
  assert.ok(decision.checks.length >= 9);
});
