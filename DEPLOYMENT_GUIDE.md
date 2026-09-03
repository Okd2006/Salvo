# ?? Salvo Deployment Guide

**Last Updated:** 2026-09-03  
**Platform:** Vercel (Frontend) + Render (Backend)

---

## ?? Architecture Overview

Salvo is split into two deployments:

1. **Frontend (React + Vite)** ? Vercel
2. **Backend (Node.js API)** ? Render.com

```
User ? Vercel (Frontend) ? Render (Backend API) ? MongoDB Atlas
                                  ?
                            Google OAuth / Razorpay
```

---

## ?? Step-by-Step Deployment

### **Phase 1: Deploy Backend to Render (20 minutes)**

#### **1.1 Create Render Account**
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

#### **1.2 Create New Web Service**
1. Click **"New +"** ? **"Web Service"**
2. Connect your `Salvo` GitHub repository
3. Configure the service:
   - **Name:** `salvo-backend`
   - **Region:** Oregon (US West)
   - **Branch:** `main`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/index.js`
   - **Instance Type:** `Free`

#### **1.3 Add Environment Variables**
In Render Dashboard ? salvo-backend ? Environment:

```bash
NODE_ENV=production
PORT=3001
GOOGLE_CLIENT_ID=346117149964-esibm2q0vanhfpgni2lbl7qp6vivhg82.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-secret-from-google-cloud>
GOOGLE_REDIRECT_URI=https://your-vercel-app.vercel.app/login
GEMINI_API_KEY=<your-gemini-key>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
MONGODB_URI=<your-mongodb-uri>
```

#### **1.4 Deploy Backend**
1. Click **"Create Web Service"**
2. Wait for deployment (~3-5 minutes)
3. Your backend URL: `https://salvo-backend.onrender.com`
4. Test: `https://salvo-backend.onrender.com/api/health`
5. Should see: `{"status":"healthy"}`

? **Backend deployed!**

---

### **Phase 2: Update Frontend (5 minutes)**

#### **2.1 Update Vercel Environment Variables**
1. Vercel Dashboard ? Your Project ? Settings ? Environment Variables
2. Add:

```bash
VITE_API_URL=https://salvo-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=346117149964-esibm2q0vanhfpgni2lbl7qp6vivhg82.apps.googleusercontent.com
```

#### **2.2 Update Google OAuth**
1. [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services ? Credentials ? Your OAuth Client
3. Add redirect URI: `https://your-vercel-app.vercel.app/login`
4. Save

#### **2.3 Redeploy**
1. Vercel Dashboard ? Deployments ? Redeploy latest
2. Wait ~1-2 minutes

? **Frontend connected to backend!**

---

## ? Testing

### Test Backend
```bash
curl https://salvo-backend.onrender.com/api/health
```

### Test Frontend
1. Open: `https://your-app.vercel.app`
2. Click "Continue with Google SSO"
3. Complete authentication
4. Dashboard should load ?

---

## ?? Troubleshooting

**"Failed to parse JSON"**  
? Check `VITE_API_URL` in Vercel

**"OAuth redirect mismatch"**  
? Add production URL to Google Cloud Console

**"Application Error"**  
? Check environment variables in Render

---

## ?? Deployment Checklist

### Backend (Render)
- [ ] Repository connected
- [ ] Build: `npm install && npm run build`
- [ ] Start: `node dist/index.js`
- [ ] All env vars added
- [ ] Health check works

### Frontend (Vercel)
- [ ] `VITE_API_URL` set
- [ ] `VITE_GOOGLE_CLIENT_ID` set
- [ ] Redeployed after env vars

### OAuth
- [ ] Production URI in Google Console
- [ ] `GOOGLE_REDIRECT_URI` matches Vercel URL
- [ ] OAuth flow tested

---

## ?? Success!

Your deployment works when:
1. ? Backend health check returns 200
2. ? Frontend loads login
3. ? Google OAuth ? Dashboard
4. ? No console errors

---

**Alternative:** Deploy backend to Railway.app (same process, auto-detects Node.js)
