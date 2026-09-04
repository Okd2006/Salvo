/**
 * src/lib/googleAuth.ts
 *
 * Server-side Google OAuth 2.0 / OIDC Authorization Service
 */
import https from 'node:https';
import { URLSearchParams } from 'node:url';

export interface GoogleUserProfile {
  googleSub: string;
  email: string;
  name: string;
  avatarUrl?: string | undefined;
}

export function isGoogleOAuthConfigured(): boolean {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  return Boolean(
    clientId &&
      clientSecret &&
      !clientId.includes('...') &&
      !clientSecret.includes('...')
  );
}

export function getGoogleOAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID || 'sandbox_google_client_id.apps.googleusercontent.com';
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: redirectUri,
    client_id: clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'openid',
    ].join(' '),
    state: state || 'salvo_g_state',
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export async function exchangeGoogleCodeForProfile(
  code: string,
  redirectUri: string
): Promise<GoogleUserProfile> {
  if (!isGoogleOAuthConfigured()) {
    return {
      googleSub: `g_sub_${code.replace(/[^a-zA-Z0-9]/g, '').slice(0, 16) || 'sandbox_operator_01'}`,
      email: 'omkrrish@payment-ops.com',
      name: 'Omkrrish',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&fit=crop&q=80',
    };
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

  const postData = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  }).toString();

  const tokenRes = await new Promise<{ access_token: string; id_token?: string }>((resolve, reject) => {
    const req = https.request(
      'https://oauth2.googleapis.com/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              reject(new Error(`Failed to parse Google token response: ${(e as Error).message}`));
            }
          } else {
            reject(new Error(`Google token exchange failed: ${body}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });

  const userProfile = await new Promise<GoogleUserProfile>((resolve, reject) => {
    const req = https.request(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenRes.access_token}`,
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const data = JSON.parse(body);
              resolve({
                googleSub: String(data.sub || `g_sub_${Date.now()}`),
                email: String(data.email || 'operator@salvo.local'),
                name: String(data.name || 'Google Operator'),
                avatarUrl: data.picture ? String(data.picture) : undefined,
              });
            } catch (e) {
              reject(new Error(`Failed to parse Google userinfo response: ${(e as Error).message}`));
            }
          } else {
            reject(new Error(`Google userinfo fetch failed: ${body}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });

  return userProfile;
}
