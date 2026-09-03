# ?? ACTION REQUIRED - Deploy Backend to Fix Vercel

**Date:** 2026-09-03
**Time Required:** 30 minutes
**Status:** Code ready, deployment needed

---

## ?? THE PROBLEM

Your Vercel site shows:
```
Failed to parse JSON response from /api/auth/google/url
```

**Why?** Vercel only has your frontend. Your backend API is NOT deployed.

---

## ? WHAT I FIXED (Already Done)

1. Updated frontend to read `VITE_API_URL` environment variable
2. Created `.env.production` template
3. Created `render.yaml` for easy backend deployment
4. Created `DEPLOYMENT_GUIDE.md` with full instructions
5. Fixed dashboard navigation after OAuth
6. Build successful: 422KB (112KB gzipped)

---

## ?? YOUR TODO LIST (30 minutes)

### 1. Commit Code Changes (2 min)
```bash
git add -A
git commit -m "fix(deployment): add backend deployment config and environment-based API URL"
git push origin main
```

### 2. Deploy Backend to Render (20 min)

1. Go to https://render.com
2. Sign up with GitHub (free)
3. Click "New +" ? "Web Service"
4. Connect your Salvo repository
5. Configure:
   - Name: `salvo-backend`
   - Build: `npm install && npm run build`
   - Start: `node dist/index.js`
   - Instance: Free
6. Add environment variables (see DEPLOYMENT_GUIDE.md)
7. Deploy and wait 3-5 minutes
8. Copy your URL: `https://salvo-backend.onrender.com`

### 3. Update Vercel Environment Variables (5 min)

1. Vercel Dashboard ? Your Project ? Settings ? Environment Variables
2. Add:
   ```
   VITE_API_URL=https://salvo-backend.onrender.com
   VITE_GOOGLE_CLIENT_ID=346117149964-esibm2q0vanhfpgni2lbl7qp6vivhg82.apps.googleusercontent.com
   ```
3. Redeploy frontend

### 4. Update Google OAuth (2 min)

1. Google Cloud Console ? Credentials
2. Add redirect URI: `https://your-vercel-app.vercel.app/login`
3. Save

### 5. Test (5 min)

1. Open your Vercel URL
2. Click "Continue with Google SSO"
3. Dashboard should load ?

---

## ?? Full Instructions

See `DEPLOYMENT_GUIDE.md` for detailed step-by-step guide.

---

## ? Success Criteria

- [ ] Backend health check works: `curl https://salvo-backend.onrender.com/api/health`
- [ ] Frontend loads without errors
- [ ] Google OAuth redirects correctly
- [ ] Dashboard displays after login

---

**START HERE:** Commit your code, then deploy to Render! ??
