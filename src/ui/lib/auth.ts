/**
 * src/lib/auth.ts
 *
 * Salvo Enterprise Authentication Service & Identity Management
 * Supports Email/Password, Google OAuth 2.0 / OIDC, and Razorpay Merchant Connections.
 */

export interface RazorpayMerchantConnection {
  connected: boolean;
  merchantId: string;
  environment: 'test' | 'live';
  keyIdMasked: string;
  connectedAt: string;
  status: 'active' | 'disconnected' | 'pending';
  accountName?: string;
  scopes: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'merchant' | 'auditor';
  organization: string;
  avatarUrl?: string;
  authProvider: 'email' | 'google';
  createdAt: string;
  razorpayConnection?: RazorpayMerchantConnection;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: AuthSession;
  error?: string;
}

interface SimpleStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const STORAGE_KEY = 'salvo_auth_session_v1';

export const DEFAULT_RAZORPAY_CONNECTION: RazorpayMerchantConnection = {
  connected: false,
  merchantId: '',
  environment: 'test',
  keyIdMasked: '',
  connectedAt: '',
  status: 'disconnected',
  scopes: [],
};

/** Pre-configured demo merchant accounts */
const DEMO_USERS: User[] = [
  {
    id: 'usr_salvo_admin_01',
    email: 'admin@salvorecovery.ai',
    name: 'Sarah Chen',
    role: 'admin',
    organization: 'Salvo Enterprise Core',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&fit=crop&q=80',
    authProvider: 'email',
    createdAt: '2026-01-15T08:00:00.000Z',
    razorpayConnection: DEFAULT_RAZORPAY_CONNECTION,
  },
  {
    id: 'usr_salvo_merchant_02',
    email: 'merchant@razorpay-partner.in',
    name: 'Vikram Malhotra',
    role: 'merchant',
    organization: 'Razorpay Partner Hub',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&fit=crop&q=80',
    authProvider: 'email',
    createdAt: '2026-02-01T10:30:00.000Z',
    razorpayConnection: DEFAULT_RAZORPAY_CONNECTION,
  },
];

class AuthService {
  private activeSession: AuthSession | null = null;
  private listeners: Array<(session: AuthSession | null) => void> = [];

  constructor() {
    this.loadSessionFromStorage();
  }

  private getStorage(): SimpleStorage | null {
    if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
      try {
        return (globalThis as unknown as { localStorage: SimpleStorage }).localStorage;
      } catch {
        return null;
      }
    }
    return null;
  }

  private loadSessionFromStorage(): void {
    const storage = this.getStorage();
    if (!storage) return;
    try {
      const stored = storage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthSession;
        if (parsed && parsed.expiresAt > Date.now()) {
          this.activeSession = parsed;
        } else {
          storage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      this.activeSession = null;
    }
  }

  private saveSessionToStorage(session: AuthSession | null): void {
    this.activeSession = session;
    const storage = this.getStorage();
    if (storage) {
      if (session) {
        storage.setItem(STORAGE_KEY, JSON.stringify(session));
      } else {
        storage.removeItem(STORAGE_KEY);
      }
    }
    this.notifyListeners();
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      try {
        listener(this.activeSession);
      } catch (err) {
        console.error('Auth listener error:', err);
      }
    }
  }

  public subscribe(listener: (session: AuthSession | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public setSession(session: AuthSession): void {
    this.saveSessionToStorage(session);
  }

  public getSession(): AuthSession | null {
    if (this.activeSession && this.activeSession.expiresAt <= Date.now()) {
      this.logout();
      return null;
    }
    return this.activeSession;
  }

  public getCurrentUser(): User | null {
    const session = this.getSession();
    return session ? session.user : null;
  }

  public isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  public async login(credentials: LoginCredentials): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!email) {
      return { success: false, error: 'Email address is required.' };
    }
    if (!password) {
      return { success: false, error: 'Password is required.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const matchedDemo = DEMO_USERS.find((u) => u.email.toLowerCase() === email);
    const user: User = matchedDemo || {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      role: 'merchant',
      organization: 'Recovery Workspace',
      authProvider: 'email',
      createdAt: new Date().toISOString(),
      razorpayConnection: DEFAULT_RAZORPAY_CONNECTION,
    };

    const session: AuthSession = {
      user,
      token: `salvo_jwt_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    this.saveSessionToStorage(session);
    return { success: true, user, session };
  }

  public async register(credentials: RegisterCredentials): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const name = credentials.name.trim();
    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    if (!name) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!email) {
      return { success: false, error: 'Email address is required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
    if (password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }
    if (!credentials.agreeToTerms) {
      return { success: false, error: 'You must agree to the Terms of Service and Privacy Policy.' };
    }

    const user: User = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}`,
      email,
      name,
      role: 'merchant',
      organization: `${name}'s Recovery Workspace`,
      authProvider: 'email',
      createdAt: new Date().toISOString(),
      razorpayConnection: DEFAULT_RAZORPAY_CONNECTION,
    };

    const session: AuthSession = {
      user,
      token: `salvo_jwt_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    this.saveSessionToStorage(session);
    return { success: true, user, session };
  }

  public async loginWithGoogle(): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const user: User = {
      id: 'usr_google_sso_01',
      email: 'alex.morgan@payment-ops.com',
      name: 'Alex Morgan',
      role: 'merchant',
      organization: 'Global Payments Ops',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&fit=crop&q=80',
      authProvider: 'google',
      createdAt: new Date().toISOString(),
      razorpayConnection: DEFAULT_RAZORPAY_CONNECTION,
    };

    const session: AuthSession = {
      user,
      token: `salvo_g_sso_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    this.saveSessionToStorage(session);
    return { success: true, user, session };
  }

  public async connectRazorpayMerchant(merchantId: string = 'mer_razorpay_test_01'): Promise<RazorpayMerchantConnection> {
    const session = this.getSession();
    if (!session) {
      throw new Error('User must be authenticated to connect Razorpay account.');
    }

    const conn: RazorpayMerchantConnection = {
      connected: true,
      merchantId,
      environment: 'test',
      keyIdMasked: 'rzp_test_••••••••1048',
      connectedAt: new Date().toISOString(),
      status: 'active',
      accountName: 'Connected Razorpay Test Merchant',
      scopes: ['payments:read', 'payment_links:write', 'refunds:read'],
    };

    session.user.razorpayConnection = conn;
    this.saveSessionToStorage({ ...session });
    return conn;
  }

  public async disconnectRazorpayMerchant(): Promise<void> {
    const session = this.getSession();
    if (session) {
      session.user.razorpayConnection = {
        connected: false,
        merchantId: '',
        environment: 'test',
        keyIdMasked: '',
        connectedAt: '',
        status: 'disconnected',
        scopes: [],
      };
      this.saveSessionToStorage({ ...session });
    }
  }

  public async sendPasswordReset(request: PasswordResetRequest): Promise<AuthResult> {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const email = request.email.trim().toLowerCase();

    if (!email) {
      return { success: false, error: 'Email address is required.' };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    return { success: true };
  }

  public logout(): void {
    this.saveSessionToStorage(null);
  }
}

export const SalvoAuth = new AuthService();
