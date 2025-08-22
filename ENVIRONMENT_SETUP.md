# 🔧 Environment Setup Guide

## 🚨 **CRITICAL: Security Configuration Required**

Your application now uses **secure authentication** instead of hardcoded passwords. Follow these steps to complete the setup:

## 📋 **Step 1: Generate Secure Admin Password Hash**

```bash
# Navigate to backend directory
cd backend

# Generate a secure password hash (replace with your own secure password)
node scripts/generateAdminHash.js "your-super-secure-admin-password-2024"
```

This will output something like:

```
🔐 Generated Admin Password Hash:
==================================================
Password: your-super-secure-admin-password-2024
Hash: $2b$12$abcd1234...your-generated-hash...
==================================================

📝 Add this to your backend/.env file:
ADMIN_PASSWORD_HASH=$2b$12$abcd1234...your-generated-hash...
```

## 📋 **Step 2: Configure Backend Environment**

Create `backend/.env` file:

```bash
# Create backend/.env file
touch backend/.env
```

Add these variables to `backend/.env`:

```env
# === REQUIRED FOR SECURITY ===
# Use the hash generated in Step 1
ADMIN_PASSWORD_HASH=$2b$12$your_generated_hash_from_step_1

# Get this from your Stripe Dashboard > Webhooks
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# === EXISTING CONFIGURATION ===
# Your existing database and Stripe configuration
DATABASE_URL=postgresql://...your-existing-database-url...
DIRECT_URL=postgresql://...your-existing-direct-url...
STRIPE_SECRET_KEY=sk_test_...your-existing-stripe-key...
CLIENT_URL=http://localhost:3001
PORT=3000
NODE_ENV=development
```

## 📋 **Step 3: Configure Frontend Environment**

Create `frontend/.env.local` file:

```bash
# Create frontend/.env.local file
touch frontend/.env.local
```

Add this to `frontend/.env.local`:

```env
# === ADMIN PASSWORD ===
# Use the SAME password you used in Step 1 (not the hash!)
NEXT_PUBLIC_ADMIN_PASSWORD=your-super-secure-admin-password-2024

# === API CONFIGURATION ===
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📋 **Step 4: Restart Servers**

```bash
# Stop all running servers (Ctrl+C)

# Restart both servers
npm run dev
```

## ✅ **Verification Checklist**

Check these in your terminal output:

### Backend Server Logs Should Show:

```
✅ Database connected (direct connection)
Environment check:
STRIPE_SECRET_KEY exists: true
ADMIN_PASSWORD_HASH configured: true
STRIPE_WEBHOOK_SECRET configured: true
🚀 PRODUCTION Server running on port 3000
```

### Frontend Should Work:

-   Navigate to `http://localhost:3001/admin`
-   Use your secure password (from Step 1) to login
-   ❌ `admin123` should no longer work

## 🔐 **Security Status After Setup**

| Component            | Status    | Description               |
| -------------------- | --------- | ------------------------- |
| Admin Authentication | ✅ SECURE | bcrypt hashed passwords   |
| Stripe Webhooks      | ✅ SECURE | Signature verification    |
| Rate Limiting        | ✅ ACTIVE | DDoS protection           |
| Input Validation     | ✅ ACTIVE | XSS/injection protection  |
| Security Headers     | ✅ ACTIVE | CSP and security policies |
| Logging              | ✅ ACTIVE | Security event tracking   |

## 🚨 **Troubleshooting**

### Backend Shows "ADMIN_PASSWORD_HASH not configured"

-   ✅ Run Step 1 to generate the hash
-   ✅ Add the hash to `backend/.env`
-   ✅ Restart the backend server

### Frontend Shows "Invalid password"

-   ✅ Check that `frontend/.env.local` has the same password (not hash) from Step 1
-   ✅ Restart the frontend server
-   ✅ Clear browser cache

### Stripe Webhook Errors

-   ✅ Get webhook secret from Stripe Dashboard > Webhooks
-   ✅ Add `STRIPE_WEBHOOK_SECRET` to `backend/.env`
-   ✅ Restart backend server

## 🎉 **Success!**

Once complete, your Hope & Failure band website will have **enterprise-grade security** and be ready for production deployment!

---

**Need help?** Check the server logs for specific error messages and follow the troubleshooting steps above.
