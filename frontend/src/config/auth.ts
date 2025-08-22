// Frontend Authentication Configuration
// This centralizes the admin password configuration

/**
 * Get the admin password from environment variables
 * Falls back to a default for development if not configured
 */
export function getAdminPassword(): string {
    // Try to get from environment variable first
    const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (envPassword) {
        return envPassword;
    }

    // Development fallback - replace this with your secure password
    // TODO: Set NEXT_PUBLIC_ADMIN_PASSWORD in your .env.local file
    console.warn(
        '⚠️ Using development admin password. Set NEXT_PUBLIC_ADMIN_PASSWORD in .env.local for production!'
    );
    return 'secure-admin-password-2024';
}

/**
 * Validate if a password matches the configured admin password
 */
export function validateAdminPassword(inputPassword: string): boolean {
    const adminPassword = getAdminPassword();
    return inputPassword === adminPassword;
}

/**
 * Configuration instructions for developers
 */
export const SETUP_INSTRUCTIONS = {
    message: 'Admin password not properly configured',
    steps: [
        '1. Create frontend/.env.local file',
        '2. Add: NEXT_PUBLIC_ADMIN_PASSWORD="your-secure-password"',
        '3. Use the same password you set for the backend ADMIN_PASSWORD_HASH',
        '4. Restart the development server',
    ],
};

// Type for admin authentication context
export interface AdminAuthState {
    isAuthenticated: boolean;
    password: string;
    loading: boolean;
    error: string | null;
}
