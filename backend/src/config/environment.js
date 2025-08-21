require('dotenv').config();

// Fallback environment variables for testing
if (!process.env.STRIPE_SECRET_KEY) {
    console.error('⚠️  STRIPE_SECRET_KEY not found in environment variables!');
    console.error(
        'Please create backend/.env file with your Stripe secret key'
    );
    console.error('Example: STRIPE_SECRET_KEY=sk_test_your_key_here');
    process.exit(1); // Exit if no Stripe key is provided
}
if (!process.env.CLIENT_URL) {
    process.env.CLIENT_URL = 'http://localhost:3001'; // Updated for Next.js port
}

// Debug environment variables
console.log('Environment check:');
console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
console.log(
    'STRIPE_SECRET_KEY length:',
    process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0
);
console.log('CLIENT_URL:', process.env.CLIENT_URL);

module.exports = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    CLIENT_URL: process.env.CLIENT_URL,
    PORT: process.env.PORT || 3000,
    DATABASE_URL:
        process.env.DATABASE_URL ||
        'postgresql://user:password@localhost:5432/hopeandailure',
    NODE_ENV: process.env.NODE_ENV || 'development',
};
