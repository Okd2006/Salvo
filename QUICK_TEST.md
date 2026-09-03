# Quick Testing Guide

## Step 1: Start Backend (Terminal 1)
```bash
npm run dev:server
```
Expected: Server starts on http://localhost:3001

## Step 2: Start Frontend (Terminal 2 - NEW WINDOW)
```bash
npm run dev
```
Expected: Frontend runs on http://localhost:3000

## Step 3: Test Google OAuth
1. Open http://localhost:3000
2. Click "Continue with Google SSO"
3. Login with Google account
4. Should redirect back to dashboard

## Verification
- [ ] Backend running on :3001
- [ ] Frontend running on :3000
- [ ] Login page loads
- [ ] Google OAuth works
- [ ] Dashboard shows after login

## Quick Test
```bash
curl http://localhost:3001/api/health
```

Should return: `{"status":"healthy","googleConfigured":true,...}`
