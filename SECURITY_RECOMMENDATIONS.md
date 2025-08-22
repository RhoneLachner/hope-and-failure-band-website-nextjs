# Security & Performance Recommendations

## 🚨 IMMEDIATE SECURITY FIXES REQUIRED

### 1. Replace Hardcoded Admin Password (CRITICAL)

**Current Risk**: `admin123` is hardcoded throughout the application
**Solution**: Implement proper authentication

```javascript
// backend/src/middleware/auth.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Replace hardcoded password with environment variable
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

async function requireAdmin(req, res, next) {
    const { password } = req.body;

    if (!password || !(await bcrypt.compare(password, ADMIN_PASSWORD_HASH))) {
        return res.status(401).json({
            success: false,
            error: 'Invalid credentials',
        });
    }
    next();
}
```

**Setup Instructions**:

1. Generate password hash: `bcrypt.hash('YOUR_SECURE_PASSWORD', 12)`
2. Add to environment: `ADMIN_PASSWORD_HASH=<hash>`
3. Update all admin routes to use new middleware

### 2. Fix Stripe Webhook Security (CRITICAL)

**Current Risk**: No signature verification allows payment fraud

```javascript
// backend/src/routes/stripe.js
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (req, res) => {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        try {
            // VERIFY SIGNATURE - Currently missing!
            const event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                endpointSecret
            );
            // ... handle event
        } catch (err) {
            console.log(`Webhook signature verification failed.`, err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
    }
);
```

### 3. Implement Rate Limiting (HIGH PRIORITY)

```javascript
// backend/src/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max) =>
    rateLimit({
        windowMs,
        max,
        message: { success: false, error: 'Too many requests' },
    });

// Apply to all routes
app.use('/api/', createRateLimit(15 * 60 * 1000, 100)); // 100 requests per 15 minutes
app.use('/api/admin/', createRateLimit(15 * 60 * 1000, 10)); // 10 admin requests per 15 minutes
```

### 4. Enhanced Input Validation

```javascript
// backend/src/middleware/validation.js
const validator = require('validator');
const DOMPurify = require('dompurify');

function sanitizeInput(req, res, next) {
    Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === 'string') {
            req.body[key] = validator.escape(req.body[key]);
        }
    });
    next();
}

function validateEmail(email) {
    return validator.isEmail(email) && validator.isLength(email, { max: 254 });
}
```

### 5. Add CORS Security Headers

```javascript
// backend/src/middleware/security.js
const helmet = require('helmet');

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", 'js.stripe.com'],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", 'api.stripe.com'],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
    })
);
```

## ⚡ PERFORMANCE OPTIMIZATIONS

### 1. Database Optimization

```sql
-- Add indexes to frequently queried fields
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_videos_order ON videos("order");
CREATE INDEX idx_lyrics_order ON lyrics("order");
```

### 2. Frontend Code Splitting

```javascript
// frontend/src/app/admin/page.tsx
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('../../components/admin/AdminPanel'), {
    loading: () => <p>Loading admin panel...</p>,
});
```

### 3. API Response Caching

```javascript
// backend/src/middleware/cache.js
const cache = require('memory-cache');

function cacheMiddleware(duration) {
    return (req, res, next) => {
        const key = req.originalUrl;
        const cached = cache.get(key);

        if (cached) {
            return res.json(cached);
        }

        res.sendResponse = res.json;
        res.json = (body) => {
            cache.put(key, body, duration * 1000);
            res.sendResponse(body);
        };
        next();
    };
}

// Apply to read-only endpoints
app.get('/api/events', cacheMiddleware(300), eventRoutes); // 5 min cache
```

### 4. Image Optimization

```javascript
// next.config.js
module.exports = {
    images: {
        domains: ['your-domain.com'],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
};
```

## 🔧 ENVIRONMENT VARIABLES NEEDED

```bash
# Security
ADMIN_PASSWORD_HASH=<bcrypt_hash>
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=<random_256_bit_key>

# Performance
REDIS_URL=<redis_connection> # For session storage
CDN_URL=<your_cdn> # For static assets
```

## 📊 MONITORING RECOMMENDATIONS

### 1. Add Request Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});
```

### 2. Health Check Enhancements

```javascript
app.get('/api/health', async (req, res) => {
    const checks = {
        database: await checkDatabase(),
        stripe: await checkStripe(),
        memory: process.memoryUsage(),
        uptime: process.uptime(),
    };

    const allHealthy = Object.values(checks).every((check) =>
        typeof check === 'object' ? check.status === 'ok' : check
    );

    res.status(allHealthy ? 200 : 503).json(checks);
});
```

## 🎯 IMPLEMENTATION PRIORITY

1. **Week 1**: Fix admin password + Stripe webhook security
2. **Week 2**: Add rate limiting + input validation
3. **Week 3**: Database optimization + caching
4. **Week 4**: Frontend performance + monitoring

## ✅ VALIDATION CHECKLIST

-   [ ] Admin password is environment-based and hashed
-   [ ] Stripe webhooks verify signatures
-   [ ] Rate limiting is active on all endpoints
-   [ ] Input validation sanitizes all user data
-   [ ] Database queries use proper indexes
-   [ ] Frontend code is split and lazy-loaded
-   [ ] Monitoring and logging are implemented
-   [ ] All sensitive data is in environment variables
