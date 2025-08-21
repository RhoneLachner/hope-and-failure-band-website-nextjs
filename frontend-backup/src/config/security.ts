interface SecurityConfig {
    stripe: {
        publicKey: string;
        apiVersion: string;
    };
    api: {
        baseUrl: string;
        timeout: number;
    };
    rateLimit: {
        maxRequests: number;
        windowMs: number;
    };
    csp: {
        enabled: boolean;
        directives: Record<string, string[]>;
    };
}

export const securityConfig: SecurityConfig = {
    stripe: {
        publicKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
        apiVersion: '2023-10-16',
    },
    api: {
        baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
        timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
    },
    rateLimit: {
        maxRequests: Number(import.meta.env.VITE_RATE_LIMIT_REQUESTS) || 100,
        windowMs: Number(import.meta.env.VITE_RATE_LIMIT_DURATION) || 3600,
    },
    csp: {
        enabled: import.meta.env.VITE_CSP_ENABLED === 'true',
        directives: {
            'default-src': ["'self'"],
            'script-src': ["'self'", 'js.stripe.com'],
            'style-src': ["'self'", "'unsafe-inline'"],
            'img-src': ["'self'", 'data:', 'https:'],
            'connect-src': ["'self'", 'api.stripe.com'],
            'frame-src': ["'self'", 'js.stripe.com'],
            'font-src': ["'self'", 'data:'],
            'object-src': ["'none'"],
            'base-uri': ["'self'"],
            'form-action': ["'self'"],
            'frame-ancestors': ["'none'"],
        },
    },
};

// Security utility functions
export const security = {
    validatePrice: (price: number, expectedPrice: number): boolean => {
        return price === expectedPrice && price > 0;
    },

    validateCartItem: (item: { id: string; price: number }): boolean => {
        // Add validation logic here
        return true;
    },

    sanitizeInput: (input: string): string => {
        return input.replace(/[<>]/g, '');
    },

    generateNonce: (): string => {
        return Math.random().toString(36).substring(2);
    },

    rateLimit: {
        isAllowed: (requestCount: number): boolean => {
            return requestCount <= securityConfig.rateLimit.maxRequests;
        },
    },
};

// API request headers
export const getSecureHeaders = () => ({
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
});

// Error types for security-related issues
export enum SecurityErrorType {
    INVALID_PRICE = 'INVALID_PRICE',
    INVALID_CART_ITEM = 'INVALID_CART_ITEM',
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
    INVALID_INPUT = 'INVALID_INPUT',
}

export class SecurityError extends Error {
    constructor(public type: SecurityErrorType, message: string) {
        super(message);
        this.name = 'SecurityError';
    }
}
