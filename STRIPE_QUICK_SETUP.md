# 🚀 Quick Stripe Setup

## ⚡ **2-Minute Setup to Test Stripe**

### 1. **Get Your Test Key**

1. Go to [stripe.com](https://stripe.com) → Sign up/Login
2. Dashboard → Developers → API keys
3. Copy your **Publishable key** (starts with `pk_test_`)

### 2. **Add Your Key**

Edit `app/config/stripe.ts` line 8:

```typescript
'pk_test_YOUR_ACTUAL_KEY_HERE', // Replace this!
```

### 3. **Test It!**

-   Add items to cart
-   Click "Secure Checkout"
-   Use test card: `4242 4242 4242 4242`
-   Any future expiry date
-   Any 3-digit CVV

## ✅ **Fixed Issues:**

-   ✅ **Content Security Policy** - Added Stripe domains
-   ✅ **Environment Variables** - Using Vite's `import.meta.env`
-   ✅ **Stripe Script Loading** - CSP now allows `js.stripe.com`

## 🎯 **What Works Now:**

-   Professional checkout form
-   Real Stripe payment processing
-   Customer information collection
-   Order confirmations
-   Inventory management

**That's it! Your Stripe integration is ready to test.** 🎉
