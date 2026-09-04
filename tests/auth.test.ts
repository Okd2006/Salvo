/**
 * tests/auth.test.ts
 *
 * Unit tests for Salvo Authentication Service, Google SSO, and Razorpay Merchant Connection
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { SalvoAuth } from '../src/lib/auth.js';

test('1. Auth: Login fails with empty credentials', async () => {
  SalvoAuth.logout();
  const res1 = await SalvoAuth.login({ email: '', password: '' });
  assert.equal(res1.success, false);
  assert.ok(res1.error?.includes('Email'));

  const res2 = await SalvoAuth.login({ email: 'test@example.com', password: '' });
  assert.equal(res2.success, false);
  assert.ok(res2.error?.includes('Password'));
});

test('2. Auth: Login fails with malformed email', async () => {
  SalvoAuth.logout();
  const res = await SalvoAuth.login({ email: 'invalid-email-address', password: 'password123' });
  assert.equal(res.success, false);
  assert.ok(res.error?.includes('valid email'));
});

test('3. Auth: Login succeeds with demo admin credentials', async () => {
  SalvoAuth.logout();
  const res = await SalvoAuth.login({
    email: 'admin@salvorecovery.ai',
    password: 'Salvo@2026!',
  });
  assert.equal(res.success, true);
  assert.ok(res.user);
  assert.equal(res.user.email, 'admin@salvorecovery.ai');
  assert.equal(res.user.role, 'admin');
  assert.equal(res.user.authProvider, 'email');
  assert.ok(res.user.razorpayConnection?.connected);
  assert.ok(res.session?.token.startsWith('salvo_jwt_'));
  assert.equal(SalvoAuth.isAuthenticated(), true);
});

test('4. Auth: Register validates name, email, password length, and terms', async () => {
  SalvoAuth.logout();

  // Missing name
  const res1 = await SalvoAuth.register({
    name: '',
    email: 'new@partner.io',
    password: 'Password123!',
    agreeToTerms: true,
  });
  assert.equal(res1.success, false);

  // Short password (< 8)
  const res2 = await SalvoAuth.register({
    name: 'Omkrrish',
    email: 'new@partner.io',
    password: 'short',
    agreeToTerms: true,
  });
  assert.equal(res2.success, false);
  assert.ok(res2.error?.includes('8 characters'));

  // Disagreed terms
  const res3 = await SalvoAuth.register({
    name: 'Omkrrish',
    email: 'new@partner.io',
    password: 'ValidPassword123!',
    agreeToTerms: false,
  });
  assert.equal(res3.success, false);
  assert.ok(res3.error?.includes('Terms'));

  // Valid registration
  const res4 = await SalvoAuth.register({
    name: 'Omkrrish',
    email: 'omkrrish@partner.io',
    password: 'ValidPassword123!',
    agreeToTerms: true,
  });
  assert.equal(res4.success, true);
  assert.equal(res4.user?.name, 'Omkrrish');
  assert.equal(res4.user?.email, 'omkrrish@partner.io');
  assert.equal(res4.user?.authProvider, 'email');
  assert.equal(SalvoAuth.isAuthenticated(), true);
});

test('5. Auth: Google SSO signs in valid operator session with Google provider', async () => {
  SalvoAuth.logout();
  const res = await SalvoAuth.loginWithGoogle();
  assert.equal(res.success, true);
  assert.ok(res.user?.email);
  assert.equal(res.user?.authProvider, 'google');
  assert.ok(res.session?.token.startsWith('salvo_g_sso_'));
  assert.equal(SalvoAuth.isAuthenticated(), true);
});

test('6. Auth: Razorpay merchant account connect and disconnect lifecycle', async () => {
  await SalvoAuth.login({
    email: 'merchant@razorpay-partner.in',
    password: 'Salvo@2026!',
  });
  assert.equal(SalvoAuth.isAuthenticated(), true);

  // Disconnect
  await SalvoAuth.disconnectRazorpayMerchant();
  const disconnectedUser = SalvoAuth.getCurrentUser();
  assert.equal(disconnectedUser?.razorpayConnection?.connected, false);
  assert.equal(disconnectedUser?.razorpayConnection?.status, 'disconnected');

  // Connect
  const conn = await SalvoAuth.connectRazorpayMerchant('mer_test_custom_99');
  assert.equal(conn.connected, true);
  assert.equal(conn.merchantId, 'mer_test_custom_99');
  assert.equal(conn.environment, 'test');
  assert.equal(SalvoAuth.getCurrentUser()?.razorpayConnection?.merchantId, 'mer_test_custom_99');
});

test('7. Auth: Password reset dispatches for valid email', async () => {
  const invalidRes = await SalvoAuth.sendPasswordReset({ email: 'not-an-email' });
  assert.equal(invalidRes.success, false);

  const validRes = await SalvoAuth.sendPasswordReset({ email: 'merchant@partner.com' });
  assert.equal(validRes.success, true);
});

test('8. Auth: Logout clears active session state', async () => {
  await SalvoAuth.login({
    email: 'admin@salvorecovery.ai',
    password: 'Salvo@2026!',
  });
  assert.equal(SalvoAuth.isAuthenticated(), true);

  SalvoAuth.logout();
  assert.equal(SalvoAuth.isAuthenticated(), false);
  assert.equal(SalvoAuth.getSession(), null);
  assert.equal(SalvoAuth.getCurrentUser(), null);
});
