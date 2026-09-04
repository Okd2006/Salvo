# Vercel Production Deployment Guide

## 🚨 Current Issue

The Salvo chatbot fails on production (Vercel) with "can't connect" error because **environment variables are missing**.

**Root Cause:** The `.env` file is correctly excluded from Git (for security), but Vercel doesn't have access to these variables.

---

## ✅ Solution: Configure Environment Variables in Vercel

### Step 1: Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Salvo** project
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)

---

### Step 2: Add ALL Required Environment Variables

**Copy these EXACT variable names and values from your local `.env` file:**

#### 🤖 AI Provider (Groq - PRIMARY)
```
LLM_PROVIDER=groq
GROQ_API_KEY=<copy from your local .env file>
GROQ_MODEL=llama-3.3-70b-versatile
```

#### 🗄️ Database (MongoDB)
```
MONGODB_URI=<copy from your local .env file>
MONGODB_DB_NAME=salvo
```

#### 💳 Razorpay (Test Mode)
```
RAZORPAY_KEY_ID=<copy from your local .env file>
RAZORPAY_KEY_SECRET=<copy from your local .env file>
RAZORPAY_MODE=test
RAZORPAY_WEBHOOK_SECRET=<copy from your local .env file>
```

#### 🔐 Google OAuth 2.0
```
GOOGLE_CLIENT_ID=<copy from your local .env file>
GOOGLE_CLIENT_SECRET=<copy from your local .env file>
VITE_GOOGLE_CLIENT_ID=<copy from your local .env file>
```

#### ⚙️ Engine Configuration
```
EXECUTION_SIMULATION=true
MAX_RECOVERY_ATTEMPTS=3
DATASET_SEED=salvo-buildathon-v1
DATASET_SIZE=1350
DIAGNOSIS_LIMIT=10
```

---

### Step 3: Set Environment Scopes

For **each variable** you add:

1. ✅ **Production** (checked)
2. ✅ **Preview** (checked)
3. ✅ **Development** (checked)

This ensures the chatbot works in all deployment environments.

---

### Step 4: Trigger Redeployment

After adding ALL environment variables:

1. Go to **Deployments** tab
2. Find the latest deployment (top of list)
3. Click the **⋮** (three dots) menu
4. Click **Redeploy**
5. Confirm by clicking **Redeploy** again

**⏱️ Wait 2-3 minutes** for deployment to complete.

---

### Step 5: Test Production Chatbot

1. Go to your production URL: `https://salvo-<your-vercel-id>.vercel.app`
2. Click the floating **AI Assistant** button (bottom-right)
3. Type a test message like: `"What is the recovery rate?"`
4. ✅ You should get a proper AI response!

---

## 🎯 Expected Results

### ✅ Before (Local) - Working
- Chatbot loads and responds
- Uses Groq API with llama-3.3-70b-versatile model
- Can answer questions about dashboard features

### ✅ After (Production) - Fixed
- Same behavior as local
- No more "can't connect" errors
- No more "HTTP 500" errors
- Chatbot responds intelligently to questions

---

## 🔍 Troubleshooting

### If chatbot still fails after redeployment:

#### Check 1: Verify Environment Variables Were Saved
1. Go to Vercel → Settings → Environment Variables
2. You should see **at least 14 variables** listed
3. All should have green checkmarks for Production/Preview/Development

#### Check 2: Check Vercel Deployment Logs
1. Go to Vercel → Deployments
2. Click on the latest deployment
3. Click **Runtime Logs** tab
4. Look for errors mentioning "GROQ_API_KEY", "not configured", or "503"

#### Check 3: Test API Endpoint Directly
Open this URL in your browser:
```
https://your-app.vercel.app/api/chat
```

**Expected:** `{"error":"Missing or invalid message in request body."}`  
**Bad (not fixed yet):** `{"error":"LLM provider not configured..."}`

#### Check 4: Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Try sending a chatbot message
4. Look for error messages

---

## 📝 Common Mistakes

❌ **Mistake 1:** Forgetting to check all 3 environment scopes  
✅ **Fix:** All variables must be enabled for Production, Preview, AND Development

❌ **Mistake 2:** Copying variables with extra spaces or quotes  
✅ **Fix:** Paste the raw value EXACTLY as shown (no quotes around values)

❌ **Mistake 3:** Not redeploying after adding variables  
✅ **Fix:** Variables only take effect after a fresh deployment

❌ **Mistake 4:** Missing the `VITE_` prefix for frontend variables  
✅ **Fix:** `VITE_GOOGLE_CLIENT_ID` must start with `VITE_` to be exposed to browser

---

## 🔒 Security Notes

- ✅ `.env` file is correctly excluded from Git (via `.gitignore`)
- ✅ Vercel environment variables are encrypted at rest
- ✅ Only `VITE_*` variables are exposed to the browser
- ⚠️ Never commit API keys or secrets to Git
- ⚠️ Use **Test Mode** Razorpay keys only (never production keys)

---

## 📊 Verification Checklist

Before closing this guide, verify:

- [ ] All 14+ environment variables added to Vercel
- [ ] All variables have Production + Preview + Development checked
- [ ] Redeployment triggered and completed successfully
- [ ] Production chatbot loads without errors
- [ ] Chatbot responds to test messages
- [ ] No "can't connect" or "503" errors in browser console
- [ ] Razorpay connection status shows properly (Launch screen)

---

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Chatbot opens and shows welcome message
2. ✅ Typing "summary" returns an intelligent AI response
3. ✅ No error messages or red text in chatbot
4. ✅ Browser console shows no 500/503 errors
5. ✅ Razorpay connection status loads (even if showing "Not Connected")

---

## 📞 Still Need Help?

If the chatbot still doesn't work after following this guide:

1. Check the Vercel Runtime Logs for specific error messages
2. Verify your Groq API key is valid: https://console.groq.com/keys
3. Test locally first with `npm run dev` to ensure `.env` is correct
4. Compare your Vercel environment variables with local `.env` file

---

**Last Updated:** 2026-09-04  
**Status:** Ready for production deployment 🚀
