/**
 * src/ui/components/dashboard/RazorpayConnectionCard.tsx
 *
 * Displays real Razorpay merchant account connection state from the backend.
 * Reads from /api/merchant/status (which checks actual RAZORPAY_KEY_ID config).
 */
import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import { Button } from '../ui/button.js';
import { SalvoApi } from '../../lib/api.js';
import type { MerchantConnectionStatus } from '../../lib/api.js';

export const RazorpayConnectionCard: React.FC = () => {
  const [status, setStatus] = useState<MerchantConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await SalvoApi.getMerchantStatus();
      setStatus(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connection status.');
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchStatus();
  }, []);

  const isConnected = Boolean(status?.connected);

  return (
    <Card className="border-border-hairline bg-[#020626]/95">
      <CardHeader className="p-4 pb-2 border-b border-border-hairline/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-ai-signal" />
            <CardTitle className="text-sm font-bold text-white font-sans">
              Razorpay Merchant Connection
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Badge variant="secondary" className="text-[10px] font-mono gap-1 animate-pulse">
                <span>CHECKING...</span>
              </Badge>
            ) : (
              <Badge
                variant={isConnected ? 'success' : 'destructive'}
                className="text-[10px] font-mono gap-1"
              >
                {isConnected ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>TEST GATEWAY ACTIVE</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span>NOT CONNECTED</span>
                  </>
                )}
              </Badge>
            )}
            <button
              onClick={() => void fetchStatus()}
              disabled={isLoading}
              className="text-text-tertiary hover:text-white transition-colors p-1 rounded focus:outline-none"
              title="Refresh connection status"
              aria-label="Refresh connection status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {error && (
          <div className="flex items-center gap-2 text-xs text-amber-400 font-sans mb-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Could not load connection status: {error}</span>
          </div>
        )}

        {isConnected && status ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                  Environment
                </span>
                <span className="font-mono text-recovered text-xs font-semibold uppercase">
                  {status.environment} Mode
                </span>
              </div>
              {status.keyIdMasked && (
                <div>
                  <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                    API Key ID
                  </span>
                  <span className="font-mono text-text-secondary text-xs">
                    {status.keyIdMasked}
                  </span>
                </div>
              )}
              <div>
                <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                  Status
                </span>
                <span className="font-mono text-recovered text-xs font-semibold capitalize">
                  {status.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-tertiary self-start sm:self-auto">
              <CheckCircle2 className="w-3 h-3 text-recovered" />
              <span>Razorpay Test API Authenticated</span>
            </div>
          </div>
        ) : !isLoading ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-xs">
            <div>
              <div className="text-white font-medium text-xs">
                Connect Razorpay to view real payment intelligence.
              </div>
              <p className="text-text-secondary text-[11px] mt-0.5">
                Add your Razorpay Test API keys as environment variables to activate real-time payment monitoring and recovery.
              </p>
              <p className="text-text-tertiary text-[10px] mt-1.5 font-mono">
                Required: RAZORPAY_KEY_ID · RAZORPAY_KEY_SECRET · RAZORPAY_MODE=test
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://dashboard.razorpay.com/app/keys', '_blank')}
              className="h-8 text-xs font-mono gap-1.5 self-start sm:self-auto shrink-0 border-border-hairline hover:border-primary/40 hover:text-primary"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Get API Keys</span>
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};
