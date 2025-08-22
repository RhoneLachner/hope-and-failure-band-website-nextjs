const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');
const emailService = require('../services/emailService');
const dataService = require('../services/dataService');

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { items, customerEmail } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid or empty items array',
            });
        }

        if (!customerEmail) {
            return res.status(400).json({
                success: false,
                error: 'Customer email is required',
            });
        }

        const result = await stripeService.createCheckoutSession(
            items,
            customerEmail
        );
        res.json(result);
    } catch (error) {
        console.error('❌ Checkout session creation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create checkout session',
        });
    }
});

// Process completed order
router.post('/process-order', async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                error: 'Session ID is required',
            });
        }

        // Process the order
        const orderData = await stripeService.processOrder(sessionId);

        // Update inventory
        for (const item of orderData.items) {
            const size = item.size || 'one-size';
            dataService.decrementInventoryItem(item.id, size, item.quantity);
        }

        // Send admin notification email
        const emailSent = await emailService.sendAdminEmail(orderData);

        res.json({
            success: true,
            order: orderData,
            emailSent,
        });
    } catch (error) {
        console.error('❌ Order processing failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process order',
        });
    }
});

// Test email functionality
router.post('/test-emails', async (req, res) => {
    try {
        const results = await emailService.testEmails();
        res.json(results);
    } catch (error) {
        console.error('❌ Email test failed:', error);
        res.status(500).json({
            success: false,
            error: 'Email test failed',
        });
    }
});

// Stripe webhook handler (SECURE with signature verification)
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    (req, res) => {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event;

        // Verify webhook signature for security
        try {
            if (!endpointSecret) {
                console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
                return res
                    .status(500)
                    .send('Webhook endpoint secret not configured');
            }

            // Verify the webhook signature
            const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                endpointSecret
            );
            console.log('✅ Webhook signature verified successfully');
        } catch (err) {
            console.error(
                '❌ Webhook signature verification failed:',
                err.message
            );
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                console.log('💳 Payment completed:', event.data.object.id);
                // Handle successful payment
                break;
            default:
                console.log(`🔔 Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }
);

module.exports = router;
