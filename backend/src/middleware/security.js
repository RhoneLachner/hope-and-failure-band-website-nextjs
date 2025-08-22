const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// General rate limiting for all API routes
const apiRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
        success: false,
        error: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip requests from localhost in development
    skip: (req) => {
        return (
            process.env.NODE_ENV === 'development' &&
            (req.ip === '127.0.0.1' ||
                req.ip === '::1' ||
                req.ip === '::ffff:127.0.0.1')
        );
    },
});

// Stricter rate limiting for admin routes (already implemented in auth.js)
const adminRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        success: false,
        error: 'Too many admin attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security headers configuration
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'js.stripe.com', 'checkout.stripe.com'],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'api.stripe.com', 'checkout.stripe.com'],
            frameSrc: ["'self'", 'js.stripe.com', 'checkout.stripe.com'],
            fontSrc: ["'self'", 'data:'],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // Needed for Stripe
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
    },
});

// Security middleware for sensitive operations
function secureSensitiveRoute(req, res, next) {
    // Add additional security headers for sensitive routes
    res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
}

module.exports = {
    apiRateLimit,
    adminRateLimit,
    securityHeaders,
    secureSensitiveRoute,
};
