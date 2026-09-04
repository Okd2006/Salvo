/* global URLSearchParams */
/**
 * src/ui/screens/LoginScreen.tsx
 *
 * Salvo Autonomous Payment Operations & Revenue Recovery Intelligence Login Interface.
 * Demo mode for Razorpay AI Buildathon 2026 submission.
 */
import React, { useState, useEffect } from 'react';
import { AuthLayout } from '../components/AuthLayout.js';
import { useAuth } from '../context/AuthContext.js';
import { SalvoAuth } from '../lib/auth.js';
import { Button } from '../components/ui/button.js';
import { Input } from '../components/ui/input.js';
import { Checkbox } from '../components/ui/checkbox.js';
import { Separator } from '../components/ui/separator.js';
import { Badge } from '../components/ui/badge.js';
import { DEMO_CREDENTIALS } from '../lib/auth.js';

export interface LoginScreenProps {
  onNavigate: (route: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation tracking
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;

  // Auto-fill demo credentials for easy jury access
    // Listen for Google OAuth callback parameters in URL (?code=...)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setIsSubmitting(true);
      setErrorMessage(null);
      SalvoAuth.handleGoogleCallback(code).then((result) => {
        window.history.replaceState({}, document.title, window.location.pathname);
        if (result.success) {
          onNavigate('overview');
        } else {
          setErrorMessage(result.error || 'Google authentication failed.');
          setIsSubmitting(false);
        }
      });
    }
  }, [onNavigate]);

  const handleDemoLogin = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);
    
    try {
      const result = await login({ 
        email: DEMO_CREDENTIALS.email, 
        password: DEMO_CREDENTIALS.password, 
        rememberMe: true 
      });
      if (result.success) {
        onNavigate('overview');
      } else {
        setErrorMessage(result.error || 'Demo login failed.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Demo login failed.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        onNavigate('overview');
      } else {
        setErrorMessage(result.error || 'Authentication failed. Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <AuthLayout>
      {/* Brand Logo & Header */}
      <div className="mb-6 text-center">
        {/* Official Salvo Glowing Shield Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-[22px] bg-[#03081A] border border-primary/40 flex items-center justify-center p-1.5 shadow-xl shadow-primary/20 overflow-hidden group transition-transform hover:scale-105">
            <img src="/salvo-logo.png" alt="Salvo Logo" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex justify-center mb-3">
          <Badge variant="cyan" className="gap-1.5 px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-ai-signal animate-pulse" />
            <span>ENTERPRISE RECOVERY PLATFORM</span>
          </Badge>
        </div>

        <h1 className="font-sans text-2xl sm:text-[28px] font-bold text-white tracking-tight">
          Sign in to Salvo
        </h1>
        <p className="font-sans text-sm text-text-secondary mt-1.5">
          Autonomous Payment Operations & Revenue Recovery Intelligence.
        </p>
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
              placeholder="work@company.com"
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
              placeholder="Enter your password"
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

            {/* Continue with Google SSO */}
      <button
        type="button"
        onClick={() => {
          setIsSubmitting(true);
          SalvoAuth.loginWithGoogle();
        }}
        disabled={isSubmitting}
        className="w-full bg-[#03081A] hover:bg-[#03081A]/80 border border-border-hairline hover:border-border-secondary text-white font-sans text-sm font-medium py-2.5 px-4 rounded-[48px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5c1.7 0 3 .7 3.7 1.4l2.8-2.8C16.8 2.1 14.6 1.3 12 1.3 7.5 1.3 3.7 3.8 1.9 7.5l3.4 2.6C6.2 7.1 8.8 5 12 5z" />
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
          <path fill="#FBBC05" d="M5.3 14.9c-.3-.8-.4-1.8-.4-2.9s.1-2 .4-2.9L1.9 6.5C.7 8.9 0 10.4 0 12s.7 3.1 1.9 5.5l3.4-2.6z" />
          <path fill="#34A853" d="M12 23.7c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.1-6.7-5.1L1.9 16.5C3.7 20.2 7.5 23.7 12 23.7z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <Separator />
        <div className="relative -mt-2.5 flex justify-center text-[10px] uppercase font-mono">
          <span className="bg-[#020626] px-3 text-text-tertiary">Quick Demo Access</span>
        </div>
      </div>

      {/* Demo Login Button - Buildathon Jury Access */}
      <Button
        type="button"
        variant="glow"
        onClick={handleDemoLogin}
        disabled={isSubmitting}
        className="w-full gap-3 rounded-[48px]"
      >
        <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
        <span>Demo Login (Buildathon Jury)</span>
      </Button>

      {/* Demo Credentials Info */}
      <div className="mt-4 px-4 py-3 rounded-[12px] bg-primary/10 border border-primary/30">
        <div className="flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">info</span>
          <div className="text-[11px] font-sans text-text-secondary space-y-1">
            <p className="text-primary font-semibold">Demo Credentials:</p>
            <p className="font-mono">Email: {DEMO_CREDENTIALS.email}</p>
            <p className="font-mono">Password: {DEMO_CREDENTIALS.password}</p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};
