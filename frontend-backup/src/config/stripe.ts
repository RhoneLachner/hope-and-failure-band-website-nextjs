// Stripe Configuration
// Replace with your actual Stripe publishable key from https://dashboard.stripe.com/test/apikeys

export const stripeConfig = {
    // Use environment variable if available, otherwise fallback to test key
    publishableKey:
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
        (() => {
            console.error('⚠️  VITE_STRIPE_PUBLISHABLE_KEY not found!');
            console.error(
                'Please create frontend/.env.local with: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key'
            );
            return 'STRIPE_KEY_NOT_CONFIGURED';
        })(),

    // Options for Stripe Elements
    options: {
        // You can customize appearance here
        appearance: {
            theme: 'night' as const,
            variables: {
                colorPrimary: '#ffffff',
                colorBackground: 'rgba(255, 255, 255, 0.1)',
                colorText: '#ffffff',
                borderRadius: '4px',
            },
        },
    },
};

// For production deployment, make sure to:
// 1. Create .env.local file with: VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
// 2. Use your live publishable key (pk_live_...)
// 3. Never commit live keys to version control
// 4. Vite uses import.meta.env instead of process.env
