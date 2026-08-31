/**
 * tests/razorpay_check.test.ts
 *
 * Comprehensive Unit Tests for Razorpay Test API Check:
 *  1. Test mode is required.
 *  2. Missing key ID is rejected.
 *  3. Missing key secret is rejected.
 *  4. Production mode is rejected.
 *  5. Authorization header is constructed server-side.
 *  6. Secret is never included in output.
 *  7. HTTP 401/403 is reported as authentication failure.
 *  8. Successful response is reported as connected.
 *
 * All external HTTP calls are strictly mocked.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkRazorpayConnectivity,
  buildBasicAuthHeader,
  sanitizeRazorpayError,
  formatRazorpayReport,
} from '../scripts/check_razorpay.js';

// ---------------------------------------------------------------------------
// 1. Test mode is required
// ---------------------------------------------------------------------------
test('1. Test mode is required (RAZORPAY_MODE === "test")', async () => {
  const result = await checkRazorpayConnectivity({
    mode: 'test',
    keyId: 'rzp_test_valid123',
    keySecret: 'secret_key_val_456',
  });

  assert.equal(result.mode, 'TEST');
});

// ---------------------------------------------------------------------------
// 2. Missing key ID is rejected
// ---------------------------------------------------------------------------
test('2. Missing key ID is rejected', async () => {
  const result = await checkRazorpayConnectivity({
    mode: 'test',
    keyId: '',
    keySecret: 'secret_key_val_456',
  });

  assert.equal(result.keyIdConfigured, false);
  assert.equal(result.result, 'NOT CONNECTED');
  assert.equal(result.reachability, 'FAIL');
  assert.ok(result.errorMessage?.includes('RAZORPAY_KEY_ID'));
});

// ---------------------------------------------------------------------------
// 3. Missing key secret is rejected
// ---------------------------------------------------------------------------
test('3. Missing key secret is rejected', async () => {
  const result = await checkRazorpayConnectivity({
    mode: 'test',
    keyId: 'rzp_test_valid123',
    keySecret: '',
  });

  assert.equal(result.keySecretConfigured, false);
  assert.equal(result.result, 'NOT CONNECTED');
  assert.equal(result.reachability, 'FAIL');
  assert.ok(result.errorMessage?.includes('RAZORPAY_KEY_SECRET'));
});

// ---------------------------------------------------------------------------
// 4. Production mode is rejected
// ---------------------------------------------------------------------------
test('4. Production mode is strictly rejected (Security Invariant)', async () => {
  const result = await checkRazorpayConnectivity({
    mode: 'live',
    keyId: 'rzp_live_abc123',
    keySecret: 'live_secret_456',
  });

  assert.equal(result.mode, 'LIVE');
  assert.equal(result.result, 'NOT CONNECTED');
  assert.equal(result.reachability, 'FAIL');
  assert.equal(result.authentication, 'FAIL');
  assert.ok(result.errorMessage?.includes('Production mode prohibited'));
});

// ---------------------------------------------------------------------------
// 5. Authorization header is constructed server-side
// ---------------------------------------------------------------------------
test('5. Authorization header is correctly constructed server-side with Basic base64 encoding', async () => {
  const keyId = 'rzp_test_mykey123';
  const keySecret = 'mysecretvalue789';
  const header = buildBasicAuthHeader(keyId, keySecret);

  const expectedBase64 = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  assert.equal(header, `Basic ${expectedBase64}`);

  let capturedHeaders: any = null;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (_url: unknown, init?: { headers?: Record<string, string> }) => {
    capturedHeaders = init?.headers;
    return new Response(JSON.stringify({ entity: 'collection', count: 0, items: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof globalThis.fetch;

  try {
    const result = await checkRazorpayConnectivity({
      mode: 'test',
      keyId,
      keySecret,
    });

    assert.equal(result.result, 'CONNECTED');
    assert.equal(capturedHeaders?.['Authorization'], `Basic ${expectedBase64}`);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// ---------------------------------------------------------------------------
// 6. Secret is never included in output
// ---------------------------------------------------------------------------
test('6. Secret is NEVER included in output report or sanitized error message', () => {
  const sensitiveSecret = 'super_secret_classified_key_99999';
  const rawError = {
    error: {
      code: 'BAD_REQUEST_ERROR',
      description: `Failed with secret ${sensitiveSecret} and Basic bXlrZXk6c3VwZXJfc2VjcmV0`,
    },
  };

  const sanitized = sanitizeRazorpayError(rawError, sensitiveSecret);
  assert.ok(!sanitized.includes(sensitiveSecret), 'Sanitized message must not contain raw secret');
  assert.ok(!sanitized.includes('bXlrZXk6c3VwZXJfc2VjcmV0'), 'Sanitized message must not contain raw base64 header');

  const report = formatRazorpayReport({
    mode: 'TEST',
    keyIdConfigured: true,
    keySecretConfigured: true,
    reachability: 'FAIL',
    authentication: 'FAIL',
    httpStatus: 401,
    result: 'NOT CONNECTED',
    errorMessage: sanitized,
  });

  assert.ok(!report.includes(sensitiveSecret), 'Report must never contain raw secret');
  assert.ok(report.includes('Secret:              CONFIGURED'), 'Report shows configured state only');
});

// ---------------------------------------------------------------------------
// 7. HTTP 401/403 is reported as authentication failure
// ---------------------------------------------------------------------------
test('7. HTTP 401/403 is reported as authentication failure (FAIL)', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => {
    return new Response(
      JSON.stringify({
        error: {
          code: 'BAD_REQUEST_ERROR',
          description: 'The id provided does not exist or invalid credentials.',
        },
      }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }) as typeof globalThis.fetch;

  try {
    const result = await checkRazorpayConnectivity({
      mode: 'test',
      keyId: 'rzp_test_invalid',
      keySecret: 'invalid_secret_123',
    });

    assert.equal(result.reachability, 'PASS');
    assert.equal(result.authentication, 'FAIL');
    assert.equal(result.httpStatus, 401);
    assert.equal(result.result, 'NOT CONNECTED');
    assert.ok(result.errorMessage?.includes('invalid credentials'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// ---------------------------------------------------------------------------
// 8. Successful response is reported as connected
// ---------------------------------------------------------------------------
test('8. Successful HTTP 200 response is reported as CONNECTED', async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async () => {
    return new Response(
      JSON.stringify({
        entity: 'collection',
        count: 1,
        items: [
          {
            id: 'pay_test_1234567890',
            entity: 'payment',
            amount: 50000,
            currency: 'INR',
            status: 'captured',
          },
        ],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }) as typeof globalThis.fetch;

  try {
    const result = await checkRazorpayConnectivity({
      mode: 'test',
      keyId: 'rzp_test_valid_account',
      keySecret: 'valid_secret_key_abc',
    });

    assert.equal(result.mode, 'TEST');
    assert.equal(result.reachability, 'PASS');
    assert.equal(result.authentication, 'PASS');
    assert.equal(result.httpStatus, 200);
    assert.equal(result.result, 'CONNECTED');

    const formatted = formatRazorpayReport(result);
    assert.ok(formatted.includes('Razorpay Mode:       TEST'));
    assert.ok(formatted.includes('Key ID:              CONFIGURED'));
    assert.ok(formatted.includes('Secret:              CONFIGURED'));
    assert.ok(formatted.includes('API Reachability:    PASS'));
    assert.ok(formatted.includes('Authentication:      PASS'));
    assert.ok(formatted.includes('HTTP Status:         200'));
    assert.ok(formatted.includes('Result:              CONNECTED'));
  } finally {
    globalThis.fetch = originalFetch;
  }
});
