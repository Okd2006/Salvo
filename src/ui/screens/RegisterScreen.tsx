/**
 * src/ui/screens/RegisterScreen.tsx
 *
 * Production Fintech Registration Screen for Salvo
 */
import React, { useState, useMemo } from 'react';
import { AuthLayout } from '../components/AuthLayout.js';
import { useAuth } from '../context/AuthContext.js';

export interface RegisterScreenProps {
  onNavigate: (route: string) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigate }) => {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field validation states
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const isNameValid = name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordLengthValid = password.length >= 8;
  const isPasswordMatch = password.length > 0 && password === confirmPassword;

  // Real-time password strength calculation (0 to 4)
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'None', color: 'bg-border-hairline' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-risk' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-caution' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-ai-signal' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-recovered' };
      default:
        return { score: 0, label: 'Weak', color: 'bg-risk' };
    }
  }, [password]);

  const isFormValid =
    isNameValid &&
    isEmailValid &&
    isPasswordLengthValid &&
    isPasswordMatch &&
    agreeToTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        agreeToTerms,
      });

      if (result.success) {
        onNavigate('overview');
      } else {
        setErrorMessage(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Network error during account creation.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <AuthLayout>
      {/* Title & Introduction */}
      <div className="mb-5 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] bg-primary/15 border border-primary/30 text-primary mb-3 shadow-inner">
          <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
        </div>
        <h1 className="font-sans text-2xl sm:text-[26px] font-bold text-white tracking-tight">
          Create workspace
        </h1>
        <p className="font-sans text-sm text-text-secondary mt-1">
          Start autonomous revenue recovery for your business.
        </p>
      </div>

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

      {/* Registration Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="reg-name"
            className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1"
          >
            Full Name
          </label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            autoFocus
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNameTouched(true)}
            className={`w-full bg-[#03081A] border text-white font-sans text-sm rounded-[14px] px-4 py-2.5 transition-all placeholder:text-text-tertiary focus:outline-none ${
              nameTouched && !isNameValid
                ? 'border-risk focus:border-risk focus:ring-1 focus:ring-risk/50'
                : 'border-border-hairline focus:border-primary focus:ring-1 focus:ring-primary/50'
            }`}
          />
          {nameTouched && !isNameValid && (
            <p className="mt-1 text-[11px] text-risk font-sans">Full name is required.</p>
          )}
        </div>

        {/* Work Email */}
        <div>
          <label
            htmlFor="reg-email"
            className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1"
          >
            Work Email
          </label>
          <input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="work@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            className={`w-full bg-[#03081A] border text-white font-sans text-sm rounded-[14px] px-4 py-2.5 transition-all placeholder:text-text-tertiary focus:outline-none ${
              emailTouched && !isEmailValid
                ? 'border-risk focus:border-risk focus:ring-1 focus:ring-risk/50'
                : 'border-border-hairline focus:border-primary focus:ring-1 focus:ring-primary/50'
            }`}
          />
          {emailTouched && !isEmailValid && (
            <p className="mt-1 text-[11px] text-risk font-sans">Please enter a valid work email.</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor="reg-password"
              className="text-xs font-mono text-text-secondary uppercase tracking-wider"
            >
              Password
            </label>
            {password.length > 0 && (
              <span className="text-[11px] font-mono text-text-tertiary">
                Strength: <span className="text-white font-medium">{passwordStrength.label}</span>
              </span>
            )}
          </div>
          <div className="relative">
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              className={`w-full bg-[#03081A] border text-white font-sans text-sm rounded-[14px] px-4 py-2.5 pr-11 transition-all placeholder:text-text-tertiary focus:outline-none ${
                passwordTouched && !isPasswordLengthValid
                  ? 'border-risk focus:border-risk focus:ring-1 focus:ring-risk/50'
                  : 'border-border-hairline focus:border-primary focus:ring-1 focus:ring-primary/50'
              }`}
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

          {/* Password Strength Visual Meter */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="grid grid-cols-4 gap-1.5 h-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`h-full rounded-full transition-colors duration-300 ${
                      passwordStrength.score >= step ? passwordStrength.color : 'bg-border-hairline'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {passwordTouched && !isPasswordLengthValid && (
            <p className="mt-1 text-[11px] text-risk font-sans">
              Password must be at least 8 characters long.
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="reg-confirm"
            className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-1"
          >
            Confirm Password
          </label>
          <input
            id="reg-confirm"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setConfirmTouched(true)}
            className={`w-full bg-[#03081A] border text-white font-sans text-sm rounded-[14px] px-4 py-2.5 transition-all placeholder:text-text-tertiary focus:outline-none ${
              confirmTouched && !isPasswordMatch
                ? 'border-risk focus:border-risk focus:ring-1 focus:ring-risk/50'
                : 'border-border-hairline focus:border-primary focus:ring-1 focus:ring-primary/50'
            }`}
          />
          {confirmTouched && !isPasswordMatch && (
            <p className="mt-1 text-[11px] text-risk font-sans">Passwords do not match.</p>
          )}
        </div>

        {/* Terms Agreement Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded-[4px] bg-[#03081A] border-border-hairline text-primary focus:ring-0 focus:ring-offset-0 accent-primary"
            />
            <span className="text-xs text-text-secondary font-sans leading-relaxed">
              I agree to the{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and acknowledge the{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </label>
        </div>

        {/* Primary Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/40 disabled:cursor-not-allowed text-white font-sans text-sm font-medium py-3 rounded-[48px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Creating Workspace...</span>
              </>
            ) : (
              <>
                <span>Create account</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-border-hairline" />
        </div>
        <div className="relative flex justify-center text-[11px] uppercase font-mono">
          <span className="bg-[#020626] px-3 text-text-tertiary">OR</span>
        </div>
      </div>

      {/* Continue with Google SSO */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleSubmitting || isSubmitting}
        className="w-full bg-[#03081A] hover:bg-[#03081A]/80 border border-border-hairline hover:border-border-secondary text-white font-sans text-sm font-medium py-2.5 px-4 rounded-[48px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGoogleSubmitting ? (
          <div className="w-4 h-4 rounded-full border-2 border-text-tertiary border-t-white animate-spin" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
        )}
        <span>Sign up with Google</span>
      </button>

      {/* Switch to Sign In */}
      <div className="mt-5 text-center text-xs font-sans text-text-secondary">
        <span>Already have an account? </span>
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="text-primary hover:text-primary-hover font-medium underline underline-offset-4 transition-colors focus:outline-none"
        >
          Sign in
        </button>
      </div>
    </AuthLayout>
  );
};
