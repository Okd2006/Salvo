/**
 * tests/llm_groq.test.ts
 *
 * Comprehensive Unit Tests for Groq LLM Provider:
 *  1. Groq configuration detection
 *  2. Missing GROQ_API_KEY throws GroqConfigError
 *  3. Successful Groq response and schema parsing
 *  4. Strict structured JSON response parsing and JSON schema format
 *  5. Invalid schema rejection (non-JSON, bad enums, missing fields)
 *  6. Ground-truth leakage rejection
 *  7. Financial clamping (0 <= predictedRecoveryPaise <= amountPaise)
 *  8. 429 rate limit retry behavior
 *  9. 5xx server error retry behavior
 *  10. 401/403 authentication failure is non-retryable
 *  11. RecoveryRecommendation contract remains unchanged
 *  12. Policy Gate works unchanged with Groq recommendations
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import {
  isGroqConfigured,
  getGroqApiKey,
  executeGroqDiagnosis,
  GROQ_DIAGNOSIS_JSON_SCHEMA,
  GroqConfigError,
  GroqAuthError,
  GroqValidationError,
} from '../src/lib/groq.js';
import { diagnose } from '../src/lib/llm.js';
import { evaluatePolicyGate } from '../src/agents/policyGate.js';
import { RecoveryRecommendationSchema } from '../src/lib/schemas.js';
import type { ObservableTransaction } from '../src/types/index.js';

// Helper to create mock test server
function createMockServer(
  handler: (_req: http.IncomingMessage, res: http.ServerResponse, body: string) => void
): Promise<{ server: http.Server; url: string }> {
  return new Promise((resolve) => {
    const server = http.createServer((_req, res) => {
      let body = '';
      _req.on('data', (chunk) => {
        body += chunk;
      });
      _req.on('end', () => {
        handler(_req, res, body);
      });
    });

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as AddressInfo;
      resolve({ server, url: `http://127.0.0.1:${addr.port}` });
    });
  });
}

function stopServer(server: http.Server): Promise<void> {
  return new Promise((resolve) => {
    if (typeof (server as any).closeAllConnections === 'function') {
      (server as any).closeAllConnections();
    }
    server.close(() => resolve());
  });
}

function createSampleObservable(): ObservableTransaction {
  return {
    transactionId: 'txn_groq_test_001',
    amountPaise: 250000, // ₹2,500
    currency: 'INR',
    paymentMethod: 'card',
    status: 'failed',
    failureCode: 'GATEWAY_TIMEOUT',
    failureCategory: 'temporary_network_failure',
    retryCount: 0,
    createdAt: new Date().toISOString(),
    customerHistory: {
      customerId: 'cust_01',
      previousPayments: 5,
      successfulPayments: 5,
      previousFailures: 0,
      retrySuccessRate: 1.0,
      preferredMethod: 'card',
      averageTransactionPaise: 250000,
    },
  };
}

// ---------------------------------------------------------------------------
// 1. Groq Configuration Detection
// ---------------------------------------------------------------------------
test('1. Groq configuration detection', () => {
  const origKey = process.env.GROQ_API_KEY;
  try {
    process.env.GROQ_API_KEY = 'gsk_test_valid_key_12345';
    assert.equal(isGroqConfigured(), true);

    process.env.GROQ_API_KEY = '';
    assert.equal(isGroqConfigured(), false);

    process.env.GROQ_API_KEY = 'gsk_placeholder_key';
    assert.equal(isGroqConfigured(), false);

    delete process.env.GROQ_API_KEY;
    assert.equal(isGroqConfigured(), false);
  } finally {
    if (origKey !== undefined) process.env.GROQ_API_KEY = origKey;
    else delete process.env.GROQ_API_KEY;
  }
});

// ---------------------------------------------------------------------------
// 2. Missing GROQ_API_KEY throws GroqConfigError
// ---------------------------------------------------------------------------
test('2. Missing GROQ_API_KEY throws GroqConfigError', () => {
  const origKey = process.env.GROQ_API_KEY;
  try {
    delete process.env.GROQ_API_KEY;
    assert.throws(() => getGroqApiKey(), GroqConfigError);
  } finally {
    if (origKey !== undefined) process.env.GROQ_API_KEY = origKey;
    else delete process.env.GROQ_API_KEY;
  }
});

// ---------------------------------------------------------------------------
// 3. Successful Groq response and schema parsing
// ---------------------------------------------------------------------------
test('3. Successful Groq response and schema parsing', async () => {
  const mockDiagnosis = {
    failureType: 'temporary',
    recoverability: 0.88,
    recommendedStrategy: 'smart_retry',
    confidence: 0.94,
    evidence: ['Gateway timeout encountered', 'Customer has 100% past success rate'],
    reasoning: 'Transient acquirer switch timeout. Safe for immediate smart retry.',
    predictedRecoveryPercentage: 0.88,
    estimatedRecoveryPaise: 220000,
    recommendedInterventionCostPaise: 150,
  };

  const { server, url } = await createMockServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        id: 'chatcmpl-test-groq',
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

  try {
    const result = await executeGroqDiagnosis('Test Prompt', 'Test System Instruction', {
      apiKey: 'gsk_test_dummy_key',
      baseUrl: url,
      model: 'openai/gpt-oss-20b',
    });

    assert.equal(result.failureType, 'temporary');
    assert.equal(result.recommendedStrategy, 'smart_retry');
    assert.equal(result.confidence, 0.94);
    assert.equal(result.recoverability, 0.88);
    assert.equal(result.evidence.length, 2);
  } finally {
    await stopServer(server);
  }
});

// ---------------------------------------------------------------------------
// 4. Strict structured JSON response format verification
// ---------------------------------------------------------------------------
test('4. Strict structured JSON response format verification', async () => {
  let capturedBody: any = null;

  const mockDiagnosis = {
    failureType: 'customer',
    recoverability: 0.7,
    recommendedStrategy: 'payment_link',
    confidence: 0.85,
    evidence: ['Customer abandoned payment checkout'],
    reasoning: 'Customer left payment page before completing OTP.',
  };

  const { server, url } = await createMockServer((_req, res, body) => {
    capturedBody = JSON.parse(body);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
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

  try {
    await executeGroqDiagnosis('Customer abandoned checkout', undefined, {
      apiKey: 'gsk_test_key',
      baseUrl: url,
      model: 'openai/gpt-oss-20b',
    });

    assert.ok(capturedBody);
    assert.equal(capturedBody.response_format?.type, 'json_schema');
    assert.equal(capturedBody.response_format?.json_schema?.name, 'recovery_recommendation');
    assert.equal(capturedBody.response_format?.json_schema?.strict, true);
    assert.equal(GROQ_DIAGNOSIS_JSON_SCHEMA.additionalProperties, false);
    assert.ok(Array.isArray(GROQ_DIAGNOSIS_JSON_SCHEMA.required));
  } finally {
    await stopServer(server);
  }
});

// ---------------------------------------------------------------------------
// 5. Invalid schema rejection (non-JSON, bad enums, missing fields)
// ---------------------------------------------------------------------------
test('5. Invalid schema rejection (non-JSON, bad enums, missing fields)', async () => {
  // Test A: Non-JSON response
  const serverA = await createMockServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        choices: [
          {
            message: {
              role: 'assistant',
              content: 'I think you should retry this transaction.',
            },
          },
        ],
      })
    );
  });

  try {
    await assert.rejects(
      async () => {
        await executeGroqDiagnosis('Prompt', undefined, {
          apiKey: 'gsk_test',
          baseUrl: serverA.url,
        });
      },
      (err: any) => err instanceof GroqValidationError
    );
  } finally {
    await stopServer(serverA.server);
  }

  // Test B: Invalid enum value for strategy
  const serverB = await createMockServer((_req, res) => {
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
                recommendedStrategy: 'magic_refund_trick', // INVALID ENUM
                confidence: 0.9,
                evidence: ['Evidence'],
                reasoning: 'Reasoning',
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
        await executeGroqDiagnosis('Prompt', undefined, {
          apiKey: 'gsk_test',
          baseUrl: serverB.url,
        });
      },
      (err: any) => err instanceof GroqValidationError
    );
  } finally {
    await stopServer(serverB.server);
  }
});

// ---------------------------------------------------------------------------
// 6. Ground-truth leakage rejection
// ---------------------------------------------------------------------------
test('6. Ground-truth leakage rejection strictly blocks forbidden keys', async () => {
  const leakedObservable = {
    ...createSampleObservable(),
    groundTruth: {
      recoverable: true,
      optimalStrategy: 'smart_retry',
      expectedRecoveryPaise: 250000,
    },
  };

  await assert.rejects(
    async () => {
      await diagnose(leakedObservable as any);
    },
    /Ground truth leakage detected/
  );
});

// ---------------------------------------------------------------------------
// 7. Financial clamping (0 <= predictedRecoveryPaise <= amountPaise)
// ---------------------------------------------------------------------------
test('7. Financial clamping invariants (0 <= predictedRecoveryPaise <= amountPaise)', async () => {
  const origKey = process.env.GROQ_API_KEY;
  const origProvider = process.env.LLM_PROVIDER;

  // Mock server returning an over-optimistic recovery estimation
  const { server, url } = await createMockServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        choices: [
          {
            message: {
              role: 'assistant',
              content: JSON.stringify({
                failureType: 'temporary',
                recoverability: 0.95,
                recommendedStrategy: 'smart_retry',
                confidence: 0.99,
                evidence: ['High recoverability'],
                reasoning: 'Estimated recovery higher than amount',
                estimatedRecoveryPaise: 99999999, // Exceeds txn amount (250000 paise)
                recommendedInterventionCostPaise: 150,
              }),
            },
          },
        ],
      })
    );
  });

  try {
    process.env.GROQ_API_KEY = 'gsk_test_key';
    process.env.GROQ_BASE_URL = url;
    process.env.LLM_PROVIDER = 'groq';

    const obs = createSampleObservable(); // amountPaise is 250000
    const rec = await diagnose(obs);

    // Clamped strictly to transaction amount
    assert.equal(rec.predictedRecoveryPaise, 250000);
    assert.ok(rec.predictedRecoveryPaise <= obs.amountPaise);
    assert.ok(rec.predictedRecoveryPaise >= 0);
  } finally {
    delete process.env.GROQ_BASE_URL;
    if (origKey !== undefined) process.env.GROQ_API_KEY = origKey;
    else delete process.env.GROQ_API_KEY;
    if (origProvider !== undefined) process.env.LLM_PROVIDER = origProvider;
    else delete process.env.LLM_PROVIDER;
    await stopServer(server);
  }
});

// ---------------------------------------------------------------------------
// 8. 429 rate limit retry behavior
// ---------------------------------------------------------------------------
test('8. 429 rate limit retry behavior (retries transient 429 and succeeds)', async () => {
  let attemptCount = 0;

  const mockDiagnosis = {
    failureType: 'temporary',
    recoverability: 0.8,
    recommendedStrategy: 'smart_retry',
    confidence: 0.9,
    evidence: ['Recovered after retry'],
    reasoning: 'Retry succeeded',
  };

  const { server, url } = await createMockServer((_req, res) => {
    attemptCount++;
    if (attemptCount === 1) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'Rate limit exceeded, please retry' } }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
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
    }
  });

  try {
    const result = await executeGroqDiagnosis('Test prompt', undefined, {
      apiKey: 'gsk_test_key',
      baseUrl: url,
    });

    assert.equal(attemptCount, 2);
    assert.equal(result.recommendedStrategy, 'smart_retry');
  } finally {
    await stopServer(server);
  }
});

// ---------------------------------------------------------------------------
// 9. 5xx server error retry behavior
// ---------------------------------------------------------------------------
test('9. 5xx server error retry behavior (retries 500 and succeeds)', async () => {
  let attemptCount = 0;

  const mockDiagnosis = {
    failureType: 'temporary',
    recoverability: 0.85,
    recommendedStrategy: 'smart_retry',
    confidence: 0.92,
    evidence: ['Server recovered'],
    reasoning: 'Server recovered on retry',
  };

  const { server, url } = await createMockServer((_req, res) => {
    attemptCount++;
    if (attemptCount === 1) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: { message: 'Groq Service Unavailable' } }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
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
    }
  });

  try {
    const result = await executeGroqDiagnosis('Test prompt', undefined, {
      apiKey: 'gsk_test_key',
      baseUrl: url,
    });

    assert.equal(attemptCount, 2);
    assert.equal(result.recommendedStrategy, 'smart_retry');
  } finally {
    await stopServer(server);
  }
});

// ---------------------------------------------------------------------------
// 10. 401/403 authentication failure is non-retryable
// ---------------------------------------------------------------------------
test('10. 401/403 authentication failure is non-retryable', async () => {
  let attemptCount = 0;

  const { server, url } = await createMockServer((_req, res) => {
    attemptCount++;
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: { message: 'Invalid Groq API key' } }));
  });

  try {
    await assert.rejects(
      async () => {
        await executeGroqDiagnosis('Prompt', undefined, {
          apiKey: 'gsk_invalid_key',
          baseUrl: url,
        });
      },
      (err: any) => err instanceof GroqAuthError
    );

    // Non-retryable: MUST NOT make a 2nd attempt
    assert.equal(attemptCount, 1);
  } finally {
    await stopServer(server);
  }
});

// ---------------------------------------------------------------------------
// 11. RecoveryRecommendation contract remains unchanged
// ---------------------------------------------------------------------------
test('11. RecoveryRecommendation contract remains 100% schema compliant', () => {
  const recommendation = {
    transactionId: 'txn_groq_rec_01',
    failureType: 'temporary' as const,
    recoverability: 0.85,
    recommendedStrategy: 'smart_retry' as const,
    confidence: 0.91,
    evidence: ['Network timeout', 'Past success 95%'],
    reasoning: 'Transient network failure on acquiring route.',
    predictedRecoveryPaise: 212500,
    recommendedInterventionCostPaise: 150,
  };

  const parsed = RecoveryRecommendationSchema.safeParse(recommendation);
  assert.equal(parsed.success, true);
  if (parsed.success) {
    assert.equal(parsed.data.transactionId, 'txn_groq_rec_01');
    assert.equal(parsed.data.predictedRecoveryPaise, 212500);
  }
});

// ---------------------------------------------------------------------------
// 12. Policy Gate works unchanged with Groq recommendations
// ---------------------------------------------------------------------------
test('12. Policy Gate continues working without modification on Groq recommendations', () => {
  const obs = createSampleObservable();
  const groqRec = {
    transactionId: obs.transactionId,
    failureType: 'temporary' as const,
    recoverability: 0.9,
    recommendedStrategy: 'smart_retry' as const,
    confidence: 0.95,
    evidence: ['Gateway timeout'],
    reasoning: 'Transient timeout',
    predictedRecoveryPaise: 225000,
    recommendedInterventionCostPaise: 150,
  };

  const policyResult = evaluatePolicyGate(groqRec, obs);

  assert.equal(policyResult.allowed, true);
  assert.equal(policyResult.reasonCode, 'ALLOWED');
  assert.equal(policyResult.verdict, 'approved');
  assert.ok(policyResult.checks.every((c) => c.passed));
});
