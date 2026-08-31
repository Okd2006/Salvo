/**
 * src/ui/components/dashboard/RazorpayConnectionCard.tsx
 *
 * Displays merchant's Razorpay Account connection state and sandbox credentials.
 */
import React, { useState } from 'react';
import { CreditCard, CheckCircle2, AlertCircle, Unplug, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card.js';
import { Badge } from '../ui/badge.js';
import { Button } from '../ui/button.js';
import { useAuth } from '../../context/AuthContext.js';

export const RazorpayConnectionCard: React.FC = () => {
  const { user, connectRazorpay, disconnectRazorpay } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const connection = user?.razorpayConnection;
  const isConnected = Boolean(connection?.connected);

  const handleToggleConnect = async () => {
    setIsLoading(true);
    try {
      if (isConnected) {
        await disconnectRazorpay();
      } else {
        await connectRazorpay('mer_razorpay_test_01');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {isConnected ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                  Merchant ID
                </span>
                <span className="font-mono text-white text-xs font-semibold">
                  {connection?.merchantId || 'mer_razorpay_test_01'}
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                  Environment
                </span>
                <span className="font-mono text-recovered text-xs font-semibold uppercase">
                  {connection?.environment || 'test'} Mode
                </span>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase text-text-tertiary block">
                  API Key ID
                </span>
                <span className="font-mono text-text-secondary text-xs">
                  {connection?.keyIdMasked || 'rzp_test_••••••••1048'}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleConnect}
              disabled={isLoading}
              className="h-8 text-xs font-mono gap-1.5 self-start sm:self-auto border-border-hairline hover:bg-risk/10 hover:text-risk hover:border-risk/30"
            >
              <Unplug className="w-3.5 h-3.5" />
              <span>Disconnect</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans text-xs">
            <div>
              <div className="text-white font-medium text-xs">
                Connect your Razorpay account to start monitoring and recovering payments.
              </div>
              <p className="text-text-secondary text-[11px] mt-0.5">
                Salvo uses authenticated Razorpay Test Mode API keys to dispatch smart retries and payment links.
              </p>
            </div>

            <Button
              variant="glow"
              size="sm"
              onClick={handleToggleConnect}
              disabled={isLoading}
              className="h-8 text-xs font-mono gap-1.5 self-start sm:self-auto shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Connect Razorpay Test Account</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
