/**
 * scripts/check_razorpay.ts
 *
 * Salvo — Razorpay Test API Connectivity Verification
 *
 * SAFETY INVARIANTS:
 *  - Enforces RAZORPAY_MODE === "test" (never production/live)
 *  - Never exposes RAZORPAY_KEY_SECRET to output, errors, or logs
 *  - Performs a single read-only authenticated GET request (no mutations/payments created)
 *  - Safe server-side Basic Auth construction
 */

import 'dotenv/config';

export interface RazorpayCheckOptions {
  keyId?: string;
  keySecret?: string;
  mode?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface RazorpayCheckResult {
  mode: string;
  keyIdConfigured: boolean;
  keySecretConfigured: boolean;
  reachability: 'PASS' | 'FAIL';
  authentication: 'PASS' | 'FAIL';
  httpStatus: number | string;
  result: 'CONNECTED' | 'NOT CONNECTED';
  errorMessage?: string;
}

export function sanitizeRazorpayError(rawError: unknown, secretToRedact?: string): string {
  function clean(str: string): string {
    let result = str
      .replace(/Basic\s+[A-Za-z0-9+/=]+/gi, '[REDACTED_AUTH]')
      .replace(/[A-Za-z0-9+/=]{24,}/g, '[REDACTED_TOKEN]')
      .replace(/rzp_(test|live)_[A-Za-z0-9]+/gi, '[REDACTED_KEY_ID]');

    const secret = secretToRedact || process.env.RAZORPAY_KEY_SECRET;
    if (secret && secret.length > 3) {
      result = result.split(secret).join('[REDACTED_SECRET]');
    }
    return result;
  }

  if (typeof rawError === 'string') {
    return clean(rawError);
  }

  if (rawError && typeof rawError === 'object') {
    const obj = rawError as Record<string, unknown>;
    if (obj.error && typeof obj.error === 'object') {
      const errObj = obj.error as Record<string, unknown>;
      const desc = errObj.description ? String(errObj.description) : '';
      const code = errObj.code ? String(errObj.code) : '';
      const field = errObj.field ? ` (field: ${String(errObj.field)})` : '';
      const combined = `${code ? `[${code}] ` : ''}${desc || 'Razorpay API returned an error'}${field}`;
      return clean(combined);
    }
    if (obj.message) {
      return clean(String(obj.message));
    }
  }
  return 'Unknown API or network error';
}

export function buildBasicAuthHeader(keyId: string, keySecret: string): string {
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`;
}

export async function checkRazorpayConnectivity(
  options?: RazorpayCheckOptions
): Promise<RazorpayCheckResult> {
  const mode = (options?.mode || process.env.RAZORPAY_MODE || 'test').toLowerCase();

  // 1. Assert Test Mode (Security Invariant)
  if (mode !== 'test') {
    return {
      mode: mode.toUpperCase(),
      keyIdConfigured: false,
      keySecretConfigured: false,
      reachability: 'FAIL',
      authentication: 'FAIL',
      httpStatus: 'N/A',
      result: 'NOT CONNECTED',
      errorMessage: `Production mode prohibited. RAZORPAY_MODE must be "test", got "${mode}".`,
    };
  }

  const keyId = (options?.keyId ?? process.env.RAZORPAY_KEY_ID ?? '').trim();
  const keySecret = (options?.keySecret ?? process.env.RAZORPAY_KEY_SECRET ?? '').trim();

  const isKeyIdValid = Boolean(keyId && !keyId.includes('...') && keyId.startsWith('rzp_test_'));
  const isKeySecretValid = Boolean(keySecret && !keySecret.includes('...') && keySecret.length > 5);

  if (!isKeyIdValid || !isKeySecretValid) {
    const missing: string[] = [];
    if (!isKeyIdValid) missing.push('RAZORPAY_KEY_ID');
    if (!isKeySecretValid) missing.push('RAZORPAY_KEY_SECRET');
    return {
      mode: 'TEST',
      keyIdConfigured: isKeyIdValid,
      keySecretConfigured: isKeySecretValid,
      reachability: 'FAIL',
      authentication: 'FAIL',
      httpStatus: 'N/A',
      result: 'NOT CONNECTED',
      errorMessage: `Missing or invalid test credentials: ${missing.join(', ')}.`,
    };
  }

  const baseUrl = (options?.baseUrl || process.env.RAZORPAY_BASE_URL || 'https://api.razorpay.com/v1').replace(/\/+$/, '');
  const endpoint = `${baseUrl}/payments?count=1`;
  const timeoutMs = options?.timeoutMs || 10000;

  // 2. Server-side Basic Authentication
  const authHeader = buildBasicAuthHeader(keyId, keySecret);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'User-Agent': 'Salvo-Revenue-Recovery-Engine/1.0',
        'Connection': 'close',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const status = response.status;
    const isReachabilityPass = true;
    const isAuthPass = status !== 401 && status !== 403;

    if (response.ok) {
      return {
        mode: 'TEST',
        keyIdConfigured: true,
        keySecretConfigured: true,
        reachability: 'PASS',
        authentication: 'PASS',
        httpStatus: status,
        result: 'CONNECTED',
      };
    } else {
      let rawJson: unknown = null;
      try {
        rawJson = await response.json();
      } catch {
        // Non-JSON response
      }
      const sanitized = sanitizeRazorpayError(rawJson);
      return {
        mode: 'TEST',
        keyIdConfigured: true,
        keySecretConfigured: true,
        reachability: isReachabilityPass ? 'PASS' : 'FAIL',
        authentication: isAuthPass ? 'PASS' : 'FAIL',
        httpStatus: status,
        result: 'NOT CONNECTED',
        errorMessage: sanitized || `HTTP ${status}`,
      };
    }
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isAbort = (err as Error)?.name === 'AbortError';
    return {
      mode: 'TEST',
      keyIdConfigured: true,
      keySecretConfigured: true,
      reachability: 'FAIL',
      authentication: 'FAIL',
      httpStatus: 'N/A',
      result: 'NOT CONNECTED',
      errorMessage: isAbort ? 'Request timed out after 10s' : 'Network unreachable or connection refused',
    };
  }
}

export function formatRazorpayReport(res: RazorpayCheckResult): string {
  const lines = [
    '========================================',
    'SALVO — RAZORPAY TEST API CHECK',
    '========================================',
    '',
    `Razorpay Mode:       ${res.mode}`,
    `Key ID:              ${res.keyIdConfigured ? 'CONFIGURED' : 'NOT CONFIGURED'}`,
    `Secret:              ${res.keySecretConfigured ? 'CONFIGURED' : 'NOT CONFIGURED'}`,
    `API Reachability:    ${res.reachability}`,
    `Authentication:      ${res.authentication}`,
    `HTTP Status:         ${res.httpStatus}`,
    `Result:              ${res.result}`,
  ];

  if (res.result === 'NOT CONNECTED' && res.errorMessage) {
    lines.push('');
    lines.push(`Error:               ${res.errorMessage}`);
  }

  return lines.join('\n');
}

export async function runRazorpayCheck(): Promise<void> {
  const checkResult = await checkRazorpayConnectivity();
  console.log(formatRazorpayReport(checkResult));

  if (checkResult.result !== 'CONNECTED') {
    process.exitCode = 1;
  }
}

// Execute directly if run via CLI
const isDirectExecution =
  process.argv[1] &&
  (process.argv[1].endsWith('check_razorpay.ts') || process.argv[1].endsWith('check_razorpay.js'));

if (isDirectExecution) {
  runRazorpayCheck().catch((err) => {
    console.error('Fatal error during Razorpay test check:', err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
