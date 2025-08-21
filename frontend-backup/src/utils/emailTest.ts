import { orderEmailService } from '../services/orderEmailService';
import type { OrderEmailData } from '../services/orderEmailService';

// Test function to verify EmailJS is working
export const testAdminEmail = async () => {
    console.log('🧪 Testing admin email notification...');

    const testOrderData: OrderEmailData = {
        orderId: 'TEST-' + Date.now(),
        customerEmail: 'test@example.com',
        customerName: 'Test Customer',
        items: [
            {
                id: 'test-item',
                title: 'Test T-Shirt',
                price: 25.0,
                quantity: 1,
                size: 'M',
                image: 'test.jpg',
            },
        ],
        subtotal: 25.0,
        orderDate: new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }),
        shippingAddress: {
            line1: '123 Test Street',
            city: 'Test City',
            state: 'CA',
            postal_code: '12345',
            country: 'US',
        },
    };

    try {
        const result = await orderEmailService.sendAdminNotification(
            testOrderData
        );
        if (result) {
            console.log('✅ Test email sent successfully!');
        } else {
            console.error('❌ Test email failed');
        }
        return result;
    } catch (error) {
        console.error('❌ Test email error:', error);
        return false;
    }
};

// Make it available in browser console
if (typeof window !== 'undefined') {
    (window as any).testAdminEmail = testAdminEmail;
}
