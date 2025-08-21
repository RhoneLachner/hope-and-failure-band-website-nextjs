// Shared API types for frontend and backend communication

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// API endpoint definitions
export const API_ENDPOINTS = {
    // Inventory
    INVENTORY: '/api/inventory',
    ADMIN_INVENTORY: '/api/admin/inventory',
    INVENTORY_DECREMENT: '/api/inventory/decrement',

    // Events
    EVENTS: '/api/events',
    ADMIN_EVENTS: '/api/admin/events',

    // Videos
    VIDEOS: '/api/videos',
    ADMIN_VIDEOS: '/api/admin/videos',

    // Bio
    BIO: '/api/bio',
    ADMIN_BIO: '/api/admin/bio',

    // Lyrics
    LYRICS: '/api/lyrics',
    ADMIN_LYRICS: '/api/admin/lyrics',

    // Stripe
    CREATE_CHECKOUT_SESSION: '/api/create-checkout-session',
    STRIPE_WEBHOOK: '/api/webhook',
    PROCESS_ORDER: '/api/process-order',

    // Email testing
    TEST_EMAILS: '/api/test-emails',
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
