const { emailjs, emailConfig } = require('../config/email');

// Helper functions for email formatting
function formatItems(items) {
    return items
        .map((item) => {
            const size = item.size ? ` (${item.size})` : '';
            const total = (item.price * item.quantity).toFixed(2);
            return `• ${item.title}${size} - Qty: ${item.quantity} - $${total}`;
        })
        .join('\n');
}

function formatShippingAddress(address) {
    if (!address) return 'No shipping address provided';

    const line2 = address.line2 ? `${address.line2}\n` : '';
    return `${address.line1}\n${line2}${address.city}, ${address.state} ${address.postal_code}\n${address.country}`;
}

// Send admin notification email
async function sendAdminEmail(orderData) {
    try {
        console.log('📧 Sending admin notification email...');

        const templateParams = {
            // Email type and routing
            email_type: 'admin',
            to_email: emailConfig.adminEmail,
            reply_to: orderData.customerEmail,

            // Subject line
            subject: `New Order #${orderData.orderId}`,

            // Greeting
            greeting: `Hello Hope & Failure Team,`,
            message_intro: `You have received a new order! Here are the details:`,

            // Customer info
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,

            // Order details
            order_id: orderData.orderId,
            order_date: new Date(orderData.orderDate).toLocaleDateString(
                'en-US',
                {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }
            ),
            order_total: orderData.subtotal.toFixed(2),

            // Items
            order_items: formatItems(orderData.items),
            item_count: orderData.items.length,

            // Shipping
            shipping_address: formatShippingAddress(orderData.shippingAddress),

            // Closing
            closing_message: `Please process this order and prepare for shipping. The customer will receive a separate confirmation email.`,
            sign_off: `Best regards,<br>Hope & Failure Order System`,
        };

        // Send the email
        await emailjs.send(
            emailConfig.serviceId,
            emailConfig.orderTemplateId,
            templateParams
        );

        console.log('✅ Admin notification email sent successfully');
        return true;
    } catch (error) {
        console.error('❌ Failed to send admin notification email:', error);
        return false;
    }
}

// Test email functionality
async function testEmails() {
    try {
        console.log('🧪 Testing email service...');

        const testOrderData = {
            orderId: 'TEST_' + Date.now(),
            orderDate: new Date(),
            customerName: 'Test Customer',
            customerEmail: 'test@example.com',
            subtotal: 25.99,
            items: [
                {
                    id: 'judith-shirt',
                    title: 'Judith T-Shirt',
                    size: 'M',
                    quantity: 1,
                    price: 0.5,
                },
                {
                    id: 'judith-tote',
                    title: 'Judith Tote Bag',
                    quantity: 1,
                    price: 0.5,
                },
            ],
            shippingAddress: {
                line1: '123 Test St',
                city: 'Portland',
                state: 'OR',
                postal_code: '97202',
                country: 'US',
            },
        };

        const adminResult = await sendAdminEmail(testOrderData);
        console.log('📊 Email test results:', {
            adminEmail: adminResult,
        });

        return { success: true, adminEmail: adminResult };
    } catch (error) {
        console.error('❌ Email test failed:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendAdminEmail,
    testEmails,
    formatItems,
    formatShippingAddress,
};
