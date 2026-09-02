/**
 * src/ui/screens/ForgotPasswordScreen.tsx
 *
 * Production Fintech Password Recovery Screen for Salvo
 */
import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout.js';
import { useAuth } from '../context/AuthContext.js';

export interface ForgotPasswordScreenProps {
  onNavigate: (route: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate }) => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);

    if (!isEmailValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await resetPassword({ email: email.trim() });
      if (result.success) {
        setIsSent(true);
      } else {
        setErrorMessage(result.error || 'Failed to dispatch reset link. Please check the email.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error during reset request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* Title & Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] bg-primary/15 border border-primary/30 text-primary mb-3 shadow-inner">
          <span className="material-symbols-outlined text-[24px]">key</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-[26px] font-bold text-white tracking-tight">
          Reset your password
        </h1>
        <p className="font-sans text-sm text-text-secondary mt-1.5 max-w-sm mx-auto">
          Enter your registered work email and we'll dispatch a cryptographic password recovery link.
        </p>
      </div>

      {/* Success Notification State */}
      {isSent ? (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-4 rounded-[16px] bg-recovered/10 border border-recovered/30 text-white space-y-2">
            <div className="flex items-center gap-2 text-recovered font-medium text-sm">
              <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
              <span>Reset Link Dispatched</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              We've dispatched password reset instructions to{' '}
              <strong className="text-white font-mono">{email}</strong>. Please check your inbox and
              spam folders.
            </p>
          </div>

          <div className="p-3 rounded-[14px] bg-[#03081A] border border-border-hairline text-xs text-text-tertiary">
            <span className="text-text-secondary font-medium">Security Notice:</span> Recovery links
            are cryptographically signed and expire in 15 minutes.
          </div>

          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="w-full bg-primary hover:bg-primary-hover text-white font-sans text-sm font-medium py-3 rounded-[48px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to sign in</span>
          </button>
        </div>
      ) : (
        <>
          {/* Error Alert Message */}
          {errorMessage && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-[14px] bg-risk/10 border border-risk/40 text-risk text-xs flex items-center gap-2.5 animate-fadeIn"
            >
              <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
              <span className="flex-1 font-sans">{errorMessage}</span>
            </div>
          )}

          {/* Reset Request Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="reset-email"
                className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5"
              >
                Work Email
              </label>
              <div className="relative">
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  className={`w-full bg-[#03081A] border text-white font-sans text-sm rounded-[14px] px-4 py-2.5 transition-all placeholder:text-text-tertiary focus:outline-none ${
                    emailTouched && !isEmailValid
                      ? 'border-risk focus:border-risk focus:ring-1 focus:ring-risk/50'
                      : 'border-border-hairline focus:border-primary focus:ring-1 focus:ring-primary/50'
                  }`}
                />
                <span className="material-symbols-outlined absolute right-3.5 top-2.5 text-text-tertiary text-[18px] pointer-events-none">
                  mail
                </span>
              </div>
              {emailTouched && !isEmailValid && (
                <p className="mt-1 text-[11px] text-risk font-sans">
                  Please enter a valid work email address.
                </p>
              )}
            </div>

            {/* Primary Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || (emailTouched && !isEmailValid)}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/40 disabled:cursor-not-allowed text-white font-sans text-sm font-medium py-3 rounded-[48px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Dispatching Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send reset link</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Back to Sign In Link */}
          <div className="mt-6 text-center text-xs font-sans text-text-secondary">
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-text-secondary hover:text-white inline-flex items-center gap-1.5 font-medium transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to sign in</span>
            </button>
          </div>
        </>
      )}
    </AuthLayout>
  );
};
