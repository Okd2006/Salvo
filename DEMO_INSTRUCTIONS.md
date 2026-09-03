# Salvo AI Revenue Recovery Platform

## 🚀 Razorpay AI Buildathon 2026 - Demo Mode

### Quick Start for Jury

1. **Open the application**: [Your deployment URL] or `http://localhost:3002`
2. **Click "Demo Login (Buildathon Jury)"** button on the login screen
3. **Explore all features** with pre-populated realistic data

### Demo Credentials

```
Email: demo@salvo.buildathon
Password: demo2026
```

### Pre-Populated Demo Data

The demo account includes:

- ✅ **Failed Transactions**: 50+ realistic payment failures across different categories
- ✅ **Revenue Metrics**: ₹12.8M+ in failed payments, ₹8.4M+ recoverable
- ✅ **Recovery Strategies**: Smart retry, fraud reversal, BIN optimization, dunning links
- ✅ **Razorpay Connection**: Connected test merchant account
- ✅ **AI Diagnosis**: Gemini-powered root cause analysis
- ✅ **Policy Gate**: Safety controls and approval workflows
- ✅ **Audit Logs**: Complete immutable audit trail
- ✅ **Execution History**: Real-time recovery operations

### Features to Test

1. **Overview Dashboard** (`/overview`)
   - Revenue at risk metrics
   - Recovery potential calculation
   - Strategy recommendations
   - Real-time execution timeline

2. **Transactions** (`/transactions`)
   - Failed payment list
   - Filter by category, amount, date
   - Transaction details

3. **Diagnosis** (`/diagnosis`)
   - AI-powered root cause analysis
   - Gemini integration
   - Recovery recommendations

4. **Policy Gate** (`/policy`)
   - Safety controls
   - Risk assessment
   - Approval workflows

5. **Executor** (`/executor`)
   - Automated recovery actions
   - Real-time status tracking
   - Success metrics

6. **Audit Trail** (`/audit`)
   - Complete audit logs
   - Immutable records
   - SHA-256 hashing

### Why Demo Mode?

Google OAuth was removed for the buildathon submission to:
- **Simplify jury access** - No Google account or OAuth setup needed
- **Showcase features immediately** - Pre-populated data demonstrates full capabilities
- **Ensure reliability** - No external dependencies or API failures during evaluation
- **Focus on core innovation** - Revenue recovery AI, not authentication flows

The production version supports full Google OAuth integration (see deployment guides).

### Local Development

```bash
# Frontend (Vite)
npm run dev

# Backend (if needed)
npm run dev:server

# Build
npm run build
```

### Architecture Highlights

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **AI**: Google Gemini 2.0 Flash for diagnosis
- **Payment Integration**: Razorpay test mode
- **Authentication**: Demo mode (production: Google OAuth + JWT)

---

**Built for Razorpay AI Buildathon 2026**  
Autonomous AI agents for revenue recovery and payment operations optimization.
