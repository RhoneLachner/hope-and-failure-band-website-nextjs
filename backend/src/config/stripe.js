const { STRIPE_SECRET_KEY } = require('./environment');

const stripe = require('stripe')(STRIPE_SECRET_KEY);

// Product mapping (should match your frontend cart.ts)
const PRODUCTS = {
    'judith-shirt': {
        title: 'Judith T-Shirt',
        price: 0.5, // Test price
    },
    'judith-tote': {
        title: 'Judith Tote Bag',
        price: 0.5, // Test price
    },
};

module.exports = {
    stripe,
    PRODUCTS,
};
