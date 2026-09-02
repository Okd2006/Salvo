/**
 * src/ui/context/AuthContext.tsx
 *
 * React Authentication Context & Provider for Salvo
 */
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  SalvoAuth,
  User,
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
  PasswordResetRequest,
  AuthResult,
  RazorpayMerchantConnection,
} from '../lib/auth.js';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (credentials: RegisterCredentials) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  resetPassword: (request: PasswordResetRequest) => Promise<AuthResult>;
  connectRazorpay: (merchantId?: string) => Promise<RazorpayMerchantConnection>;
  disconnectRazorpay: () => Promise<void>;
  setSession: (session: AuthSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(() => SalvoAuth.getSession());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial session verify
    const initialSession = SalvoAuth.getSession();
    setSession(initialSession);
    setIsLoading(false);

    // Subscribe to auth state updates
    const unsubscribe = SalvoAuth.subscribe((newSession) => {
      setSession(newSession);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    const result = await SalvoAuth.login(credentials);
    if (result.success && result.session) {
      setSession(result.session);
    }
    return result;
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResult> => {
    const result = await SalvoAuth.register(credentials);
    if (result.success && result.session) {
      setSession(result.session);
    }
    return result;
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<AuthResult> => {
    const result = await SalvoAuth.loginWithGoogle();
    if (result.success && result.session) {
      setSession(result.session);
    }
    return result;
  }, []);

  const resetPassword = useCallback(async (request: PasswordResetRequest): Promise<AuthResult> => {
    return await SalvoAuth.sendPasswordReset(request);
  }, []);

  const connectRazorpay = useCallback(async (merchantId?: string): Promise<RazorpayMerchantConnection> => {
    const conn = await SalvoAuth.connectRazorpayMerchant(merchantId);
    setSession(SalvoAuth.getSession());
    return conn;
  }, []);

  const disconnectRazorpay = useCallback(async (): Promise<void> => {
    await SalvoAuth.disconnectRazorpayMerchant();
    setSession(SalvoAuth.getSession());
  }, []);

  const setSessionHandler = useCallback((newSession: AuthSession) => {
    SalvoAuth.setSession(newSession);
    setSession(newSession);
  }, []);

  const logout = useCallback(() => {
    SalvoAuth.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      user: session ? session.user : null,
      session,
      isAuthenticated: !!session,
      isLoading,
      login,
      register,
      loginWithGoogle,
      resetPassword,
      connectRazorpay,
      disconnectRazorpay,
      setSession: setSessionHandler,
      logout,
    }),
    [session, isLoading, login, register, loginWithGoogle, resetPassword, connectRazorpay, disconnectRazorpay, setSessionHandler, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
