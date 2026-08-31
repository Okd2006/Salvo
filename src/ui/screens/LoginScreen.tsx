/**
 * src/ui/screens/LoginScreen.tsx
 *
 * Salvo Competitive-Programming / Fintech Login Interface
 * Built with Watermelon UI / Shadcn-compatible components.
 */
import React, { useState } from 'react';
import { AuthLayout } from '../components/AuthLayout.js';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/ui/button.js';
import { Input } from '../components/ui/input.js';
import { Checkbox } from '../components/ui/checkbox.js';
import { Separator } from '../components/ui/separator.js';
import { Badge } from '../components/ui/badge.js';

export interface LoginScreenProps {
  onNavigate: (route: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const { login, loginWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation tracking
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await login({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (result.success) {
        onNavigate('dashboard');
      } else {
        setErrorMessage(result.error || 'Authentication failed. Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleSubmitting || isSubmitting) return;
    setIsGoogleSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        onNavigate('dashboard');
      } else {
        setErrorMessage(result.error || 'Google SSO authentication failed.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Google SSO error.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const setDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setEmailTouched(true);
    setPasswordTouched(true);
    setErrorMessage(null);
  };

  return (
    <AuthLayout>
      {/* Header Badge & Title */}
      <div className="mb-6 text-center">
        <div className="flex justify-center mb-3">
          <Badge variant="cyan" className="gap-1.5 px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-ai-signal animate-pulse" />
            <span>AUTHENTICATED PLATFORM</span>
          </Badge>
        </div>

        <h1 className="font-sans text-2xl sm:text-[28px] font-bold text-white tracking-tight">
          Sign in to Salvo
        </h1>
        <p className="font-sans text-sm text-text-secondary mt-1.5">
          Access algorithmic challenges, recovery telemetry & leaderboards.
        </p>
      </div>

      {/* Developer Quick-Workspace Access Pills */}
      <div className="mb-5 p-3 rounded-[16px] bg-[#03081A]/90 border border-border-hairline">
        <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary uppercase tracking-wider mb-2">
          <span>Quick Workspace Access</span>
          <span className="text-recovered font-semibold">Ready</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDemoCredentials('admin@salvorecovery.ai', 'Salvo@2026!')}
            className="text-left p-2 rounded-[10px] bg-surface hover:bg-surface-elevated border border-border-hairline text-xs transition-all group"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-white font-medium group-hover:text-primary transition-colors">
                Sarah Chen
              </span>
            </div>
            <span className="text-[10px] text-text-tertiary font-mono block mt-0.5 truncate">
              Admin • Core
            </span>
          </button>

          <button
            type="button"
            onClick={() => setDemoCredentials('merchant@razorpay-partner.in', 'Salvo@2026!')}
            className="text-left p-2 rounded-[10px] bg-surface hover:bg-surface-elevated border border-border-hairline text-xs transition-all group"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-ai-signal" />
              <span className="text-white font-medium group-hover:text-primary transition-colors">
                Vikram M.
              </span>
            </div>
            <span className="text-[10px] text-text-tertiary font-mono block mt-0.5 truncate">
              Merchant • Partner
            </span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-5 p-3 rounded-[14px] bg-risk/10 border border-risk/40 text-risk text-xs flex items-center gap-2.5 animate-fadeIn"
        >
          <span className="material-symbols-outlined text-[18px] shrink-0">error</span>
          <span className="flex-1 font-sans">{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1.5"
          >
            Email Address
          </label>
          <div className="relative">
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="operator@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              error={emailTouched && !isEmailValid}
              className="pr-10"
            />
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-text-tertiary text-[18px] pointer-events-none">
              mail
            </span>
          </div>
          {emailTouched && !isEmailValid && (
            <p className="mt-1 text-[11px] text-risk font-sans">Please enter a valid work email.</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-mono text-text-secondary uppercase tracking-wider"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => onNavigate('forgot-password')}
              className="text-xs font-sans text-text-secondary hover:text-primary transition-colors focus:outline-none"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              error={passwordTouched && !isPasswordValid}
              className="pr-10 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-text-tertiary hover:text-white transition-colors p-0.5 rounded focus:outline-none"
              title={showPassword ? 'Hide password' : 'Show password'}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {passwordTouched && !isPasswordValid && (
            <p className="mt-1 text-[11px] text-risk font-sans">Password is required.</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="pt-1">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label="Keep me signed in for 7 days"
          />
        </div>

        {/* Primary Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="glow"
            size="lg"
            isLoading={isSubmitting}
            disabled={isSubmitting || (emailTouched && !isFormValid)}
            className="w-full gap-2 text-sm font-semibold rounded-[48px]"
          >
            <span>Sign in</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <Separator />
        <div className="relative -mt-2.5 flex justify-center text-[10px] uppercase font-mono">
          <span className="bg-[#020626] px-3 text-text-tertiary">OR</span>
        </div>
      </div>

      {/* Continue with Google */}
      <Button
        type="button"
        variant="secondary"
        onClick={handleGoogleLogin}
        isLoading={isGoogleSubmitting}
        disabled={isGoogleSubmitting || isSubmitting}
        className="w-full gap-3 rounded-[48px] border-border-hairline hover:border-border-secondary"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.7 0 3 .7 3.7 1.4l2.8-2.8C16.8 2.1 14.6 1.3 12 1.3 7.5 1.3 3.7 3.8 1.9 7.5l3.4 2.6C6.2 7.1 8.8 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
          />
          <path
            fill="#FBBC05"
            d="M5.3 14.9c-.3-.8-.4-1.8-.4-2.9s.1-2 .4-2.9L1.9 6.5C.7 8.9 0 10.4 0 12s.7 3.1 1.9 5.5l3.4-2.6z"
          />
          <path
            fill="#34A853"
            d="M12 23.7c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.1-6.7-5.1L1.9 16.5C3.7 20.2 7.5 23.7 12 23.7z"
          />
        </svg>
        <span>Continue with Google SSO</span>
      </Button>

      {/* Switch to Register */}
      <div className="mt-6 text-center text-xs font-sans text-text-secondary">
        <span>Don't have an account? </span>
        <button
          type="button"
          onClick={() => onNavigate('register')}
          className="text-primary hover:text-primary-hover font-medium underline underline-offset-4 transition-colors focus:outline-none"
        >
          Create account
        </button>
      </div>
    </AuthLayout>
  );
};
