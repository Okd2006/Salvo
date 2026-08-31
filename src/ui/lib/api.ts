/**
 * src/lib/api.ts / src/ui/lib/api.ts
 *
 * Salvo Centralized Frontend API Client
 *
 * Provides typed, robust HTTP communication with the Salvo backend API.
 * Handles timeouts, network errors, response parsing, and error encapsulation.
 */

import type {
  ObservableTransaction,
  RecoveryRecommendation,
  PolicyResult,
  ExecutionResult,
  RecoverySessionResult,
  AuditLogDocument,
  RecoveryActionDocument,
} from '../types/index.js';

export interface OverviewMetrics {
  grossRecoveredPaise: number;
  netRecoveredPaise: number;
  totalInterventionCostPaise: number;
  totalFailedPaise: number;
  recoverablePaise: number;
  unrecoverablePaise: number;
  netRecoveryRate: number;
  recoveryYield: number;
  successfulRecoveries: number;
  activeRecoveries: number;
  policyBlocks: number;
  failedRecoveries: number;
  totalMonitored: number;
  avgConfidence: number;
  auditEventsCount: number;
  strategies: Array<{
    strategy: string;
    affectedVolume: number;
    potentialRecoveryPaise: number;
    recoveredPaise: number;
    successRate: number;
    roiMultiplier: number;
  }>;
}

export interface MerchantRevenueMetrics {
  period: 'today' | '7d' | '30d' | '90d' | 'all';
  grossCollectedPaise: number;
  refundedAmountPaise: number;
  netCollectedPaise: number;
  totalAttemptsCount: number;
  successfulCount: number;
  failedCount: number;
  failureRate: number;
  averagePaymentPaise: number;
  failedPaymentValuePaise: number;
  recoverableOpportunityPaise: number;
  recoveredValuePaise: number;
  recoveryRate: number;
  lastSynchronizedAt: string;
}

export interface MerchantConnectionStatus {
  connected: boolean;
  merchantId: string;
  environment: 'test' | 'live';
  keyIdMasked: string;
  connectedAt: string;
  lastSynchronizedAt: string;
  status: 'active' | 'disconnected' | 'pending';
  accountName: string;
  scopes: string[];
  isConfigured: boolean;
}

export class SalvoApiError extends Error {
  public statusCode: number | undefined;
  public details: unknown;

  constructor(message: string, statusCode?: number | undefined, details?: unknown) {
    super(message);
    this.name = 'SalvoApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

const getApiBaseUrl = (): string => {
  if (typeof globalThis !== 'undefined') {
    const custom = (globalThis as unknown as { __SALVO_API_URL__?: string }).__SALVO_API_URL__;
    if (custom) return custom;
  }
  return '';
};

export interface ApiRequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
    }
  }
  return parts.length > 0 ? `?${parts.join('&')}` : '';
}

async function fetchWithTimeout(url: string, options: ApiRequestOptions = {}, timeoutMs: number = 20000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new SalvoApiError(`API Request timed out after ${timeoutMs / 1000}s`, 408);
    }
    throw new SalvoApiError(err instanceof Error ? err.message : 'Network error connecting to Salvo API');
  } finally {
    clearTimeout(timeoutId);
  }
}

async function requestJson<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  const fullUrl = `${getApiBaseUrl()}${path}`;
  const response = await fetchWithTimeout(fullUrl, options);

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new SalvoApiError(`Failed to parse JSON response from ${path}`, response.status);
  }

  if (!response.ok) {
    const errorMsg = (data as { error?: string })?.error || `HTTP error ${response.status}`;
    throw new SalvoApiError(errorMsg, response.status, data);
  }

  return data as T;
}

export const SalvoApi = {
  /**
   * Health check
   */
  async getHealth(): Promise<{ status: string; razorpayConfigured?: boolean; googleConfigured?: boolean; timestamp: string }> {
    return requestJson('/api/health');
  },

  /**
   * Fetch overview metrics and telemetry (GET /api/dashboard)
   */
  async getDashboard(): Promise<OverviewMetrics> {
    return requestJson<OverviewMetrics>('/api/dashboard');
  },

  /**
   * Fetch observable transaction list (ground truth stripped)
   */
  async getTransactions(limit: number = 50, query?: string): Promise<ObservableTransaction[]> {
    const qs = buildQueryString({ limit, q: query });
    return requestJson<ObservableTransaction[]>(`/api/transactions${qs}`);
  },

  /**
   * Fetch Google OAuth authorization URL
   */
  async getGoogleOAuthUrl(redirectUri?: string, state?: string): Promise<{ authUrl: string; configured: boolean }> {
    const qs = buildQueryString({ redirectUri, state });
    return requestJson(`/api/auth/google/url${qs}`);
  },

  /**
   * Server-side Google token exchange & session callback
   */
  async exchangeGoogleCode(code: string, redirectUri?: string): Promise<{ success: boolean; user: unknown; session: unknown }> {
    return requestJson('/api/auth/google/callback', {
      method: 'POST',
      body: JSON.stringify({ code, redirectUri }),
    });
  },

  /**
   * Fetch Razorpay OAuth authorization URL
   */
  async getRazorpayOAuthUrl(redirectUri?: string, state?: string): Promise<{ authUrl: string; configured: boolean }> {
    const qs = buildQueryString({ redirectUri, state });
    return requestJson(`/api/auth/razorpay/url${qs}`);
  },

  /**
   * Fetch Razorpay merchant connection status
   */
  async getMerchantStatus(): Promise<MerchantConnectionStatus> {
    return requestJson<MerchantConnectionStatus>('/api/merchant/status');
  },

  /**
   * Fetch calculated revenue metrics from real Razorpay data
   */
  async getMerchantMetrics(period: 'today' | '7d' | '30d' | '90d' | 'all' = '30d'): Promise<MerchantRevenueMetrics> {
    const qs = buildQueryString({ period });
    const res = await requestJson<{ success: boolean; metrics: MerchantRevenueMetrics }>(`/api/merchant/metrics${qs}`);
    return res.metrics;
  },

  /**
   * Fetch payment stream with period filter
   */
  async getMerchantPayments(period: 'today' | '7d' | '30d' | '90d' | 'all' = 'all', count: number = 50): Promise<ObservableTransaction[]> {
    const qs = buildQueryString({ period, count });
    return requestJson<ObservableTransaction[]>(`/api/merchant/payments${qs}`);
  },

  /**
   * Run AI diagnosis on a failed transaction via LLM provider
   */
  async diagnose(transactionId: string): Promise<{
    success: boolean;
    recommendation: RecoveryRecommendation;
    actionId: string;
    diagnosedAt: string;
  }> {
    return requestJson('/api/diagnose', {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    });
  },

  /**
   * Run deterministic policy check
   */
  async evaluatePolicy(
    transactionId: string,
    recommendation?: RecoveryRecommendation
  ): Promise<{
    success: boolean;
    policyResult: PolicyResult;
    evaluatedAt: string;
  }> {
    return requestJson('/api/policy-gate', {
      method: 'POST',
      body: JSON.stringify({ transactionId, ...(recommendation ? { recommendation } : {}) }),
    });
  },

  /**
   * Execute approved recovery action
   */
  async execute(actionId: string): Promise<{
    success: boolean;
    executionResult: ExecutionResult;
  }> {
    return requestJson('/api/execute', {
      method: 'POST',
      body: JSON.stringify({ actionId }),
    });
  },

  /**
   * Run full end-to-end autonomous recovery
   */
  async recover(transactionId: string): Promise<{
    success: boolean;
    recoverySession: RecoverySessionResult;
  }> {
    return requestJson('/api/recover', {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    });
  },

  /**
   * Run deterministic demo scenario
   */
  async runDemo(scenario: 'success' | 'fallback' | 'risk_block' | 'confidence_block' | 'retry_limit' | 'max_attempts'): Promise<{
    success: boolean;
    scenario: string;
    recoverySession: RecoverySessionResult;
  }> {
    return requestJson('/api/demo/recovery', {
      method: 'POST',
      body: JSON.stringify({ scenario }),
    });
  },

  /**
   * Fetch audit logs
   */
  async getAuditLogs(limit: number = 100, transactionId?: string): Promise<AuditLogDocument[]> {
    const qs = buildQueryString({ limit, transactionId });
    return requestJson<AuditLogDocument[]>(`/api/audit${qs}`);
  },

  /**
   * Fetch recovery actions
   */
  async getRecoveryActions(limit: number = 50): Promise<RecoveryActionDocument[]> {
    const qs = buildQueryString({ limit });
    return requestJson<RecoveryActionDocument[]>(`/api/actions${qs}`);
  },
};
