const { stripe, PRODUCTS } = require('../config/stripe');
const { CLIENT_URL } = require('../config/environment');

// Helper functions
function getItemTitle(id) {
    return PRODUCTS[id]?.title || `Unknown Item (${id})`;
}

function getItemPrice(id) {
    return PRODUCTS[id]?.price || 0;
}

// Create Stripe checkout session
async function createCheckoutSession(items, customerEmail) {
    try {
        console.log('🛒 Creating Stripe checkout session...');
        console.log('Items:', items);
        console.log('Customer email:', customerEmail);

        const lineItems = items.map((item) => {
            const unitAmount = Math.round(getItemPrice(item.id) * 100); // Convert to cents
            const displayName = item.size
                ? `${getItemTitle(item.id)} (${item.size})`
                : getItemTitle(item.id);

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: displayName,
                        description: `Hope & Failure Merchandise`,
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            };
        });

        console.log('🔗 Line items for Stripe:', lineItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: customerEmail,
            line_items: lineItems,
            mode: 'payment',
            success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/cancel`,
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 0, // Free shipping
                            currency: 'usd',
                        },
                        display_name: 'Free Shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 10,
                            },
                        },
                    },
                },
            ],
            metadata: {
                items: JSON.stringify(items),
            },
        });

        console.log('✅ Stripe session created:', session.id);
        return { url: session.url, sessionId: session.id };
    } catch (error) {
        console.error('❌ Stripe session creation failed:', error);
        throw error;
    }
}

// Retrieve session details for order processing
async function getSessionDetails(sessionId) {
    try {
        console.log(`📋 Retrieving session details: ${sessionId}`);

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            throw new Error('Payment not completed');
        }

        return session;
    } catch (error) {
        console.error('❌ Failed to retrieve session details:', error);
        throw error;
    }
}

// Process completed order
async function processOrder(sessionId) {
    try {
        console.log(`📋 Processing order for session: ${sessionId}`);

        const session = await getSessionDetails(sessionId);

        // Parse items from metadata
        const items = JSON.parse(session.metadata.items);
        console.log('📦 Inventory update needed for items:', items);

        // Calculate totals
        const subtotal = session.amount_total / 100; // Convert from cents
        const shipping = session.total_details?.amount_shipping || 0;

        // Prepare order data
        const orderData = {
            orderId: session.id,
            orderDate: new Date(session.created * 1000),
            customerName: session.customer_details?.name || 'Unknown',
            customerEmail:
                session.customer_details?.email || session.customer_email,
            items: items.map((item) => ({
                ...item,
                title: getItemTitle(item.id),
                price: getItemPrice(item.id),
            })),
            subtotal,
            shipping: shipping / 100,
            total: subtotal + shipping / 100,
            shippingAddress: session.shipping_details?.address,
            paymentStatus: session.payment_status,
            stripeSessionId: sessionId,
        };

        console.log('📊 Order processed:', {
            orderId: orderData.orderId,
            total: orderData.total,
            items: orderData.items.length,
        });

        return orderData;
    } catch (error) {
        console.error('❌ Order processing failed:', error);
        throw error;
    }
}

module.exports = {
    createCheckoutSession,
    getSessionDetails,
    processOrder,
    getItemTitle,
    getItemPrice,
};
