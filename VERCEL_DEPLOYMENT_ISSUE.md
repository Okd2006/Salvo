# 🚨 Vercel Deployment Issue - Backend API Missing

**Time:** 2026-09-03 14:03 UTC  
**Status:** ⚠️ Action Required

---

## 🔍 Problem

Your Vercel deployment shows this error:
```
Failed to parse JSON response from /api/auth/google/url?
redirectUri=https%3A%2F%2Fsalvo-mn9px2wbo-ckd2O06s-
projects.vercel.app%2Flogin&state=salvo_google_auth_state
```

**Root Cause:** Vercel is only serving your **frontend static files**, not your **backend API**. When the frontend tries to call `/api/auth/google/url`, it gets HTML (the index.html file) instead of JSON from the API.

---

## ✅ Solution: Deploy Backend Separately

Your Salvo application has **two parts**:
1. **Frontend** (React + Vite) - Currently on Vercel ✅
2. **Backend** (Node.js API) - **NOT deployed yet** ❌

You need to deploy the backend to a separate service.

---

## 🚀 **Option 1: Deploy Backend to Render (Recommended)**

Render is free and perfect for Node.js backends.

### **Step 1: Create Render Account**
1. Go to https://render.com
2. Sign up with GitHub

### **Step 2: Create New Web Service**
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `salvo-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/index.js`
   - **Instance Type:** Free

### **Step 3: Add Environment Variables**
In Render dashboard, add these environment variables:
```
NODE_ENV=production
PORT=3001
GOOGLE_CLIENT_ID=346117149964-esibm2q0vanhfpgni2lbl7qp6vivhg82.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-secret>
GOOGLE_REDIRECT_URI=https://salvo-mn9px2wbo-ckd2O06s-projects.vercel.app/login
GEMINI_API_KEY=<your-gemini-key>
RAZORPAY_KEY_ID=<your-key>
RAZORPAY_KEY_SECRET=<your-secret>
MONGODB_URI=<your-mongodb-uri>
```

### **Step 4: Update Frontend to Use Render Backend**

After Render deploys, you'll get a URL like:
```
https://salvo-backend.onrender.com
```

Update your Vercel environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://salvo-backend.onrender.com
   ```
3. Redeploy frontend

---

## 🚀 **Option 2: Deploy Backend to Railway**

Railway is another excellent option.

### **Steps:**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your Salvo repository
5. Railway auto-detects Node.js
6. Add environment variables (same as above)
7. Get your backend URL: `https://salvo-backend.railway.app`

---

## 🚀 **Option 3: Deploy Both to Vercel (Complex)**

This requires converting your backend to Vercel Serverless Functions, which is more complex.

**Not recommended** because:
- Requires rewriting backend code
- Serverless cold starts slow down OAuth
- More debugging needed

---

## 📝 **Quick Fix for Now: Update Frontend API Base URL**

Let me update your frontend code to use an environment variable for the API URL:

### **File Changes Needed:**

**1. Update `src/ui/lib/api.ts`** - Add API base URL:
```typescript
// At the top of the file
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

**2. Create `.env.production`** in your project root:
```bash
VITE_API_URL=https://your-backend-url.onrender.com
VITE_GOOGLE_CLIENT_ID=346117149964-esibm2q0vanhfpgni2lbl7qp6vivhg82.apps.googleusercontent.com
```

---

## 🎯 **Recommended Action Plan**

### **Today (30 minutes):**
1. ✅ Deploy backend to Render (free tier)
2. ✅ Get backend URL
3. ✅ Update frontend to use backend URL
4. ✅ Redeploy frontend to Vercel
5. ✅ Test OAuth flow end-to-end

### **I'll help you with:**
1. Creating the Render configuration
2. Updating frontend API client
3. Setting up environment variables
4. Testing the deployment

---

## 🔧 **Immediate Next Steps**

Let me update your code to support dynamic API URLs:

1. Update `src/ui/lib/api.ts` to use environment variable
2. Create `.env.production` file
3. Create `render.yaml` for easy Render deployment
4. Update documentation

**Ready to proceed?** I'll make these changes now and guide you through deploying to Render.

---

## 📊 **Current Status**

✅ **Frontend:** Deployed on Vercel  
❌ **Backend:** Not deployed (needs Render/Railway)  
⚠️ **OAuth:** Broken because backend missing  
🎯 **Fix:** Deploy backend → 30 minutes  

---

**Let me know if you want to:**
- A) Deploy to Render (I'll help you set it up)
- B) Deploy to Railway (I'll help you set it up)
- C) Try Vercel Serverless (more complex, not recommended)
