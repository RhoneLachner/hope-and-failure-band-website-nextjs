import emailjs from '@emailjs/browser';
import { emailConfig } from './emailConfig';
import type { CartItem } from '../context/CartContext';

// Order email configuration
export const orderEmailConfig = {
    orderTemplateId: 'template_bugphvq', // template ID
    adminEmail: 'hope.failure.pdx@gmail.com', // admin email
};

interface OrderEmailData {
    orderId: string;
    customerEmail: string;
    customerName: string;
    items: CartItem[];
    subtotal: number;
    orderDate: string;
    shippingAddress?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };
}

class OrderEmailService {
    private isInitialized = false;

    // Initialize EmailJS (call once)
    init(): void {
        if (!this.isInitialized) {
            emailjs.init(emailConfig.publicKey);
            this.isInitialized = true;
        }
    }

    // Format items for email template
    private formatItems(items: CartItem[]): string {
        return items
            .map((item) => {
                const size = item.size ? ` (${item.size})` : '';
                const total = (item.price * item.quantity).toFixed(2);
                return `• ${item.title}${size} - Qty: ${item.quantity} - $${total}`;
            })
            .join('\n');
    }

    // Format shipping address for email
    private formatShippingAddress(
        address?: OrderEmailData['shippingAddress']
    ): string {
        if (!address) return 'No shipping address provided';

        const line2 = address.line2 ? `${address.line2}\n` : '';
        return `${address.line1}\n${line2}${address.city}, ${address.state} ${address.postal_code}\n${address.country}`;
    }

    // Send order notification email to admin
    async sendAdminNotification(orderData: OrderEmailData): Promise<boolean> {
        this.init();

        try {
            const templateParams = {
                // Admin notification specific
                admin_subject: `New Order #${orderData.orderId}`,

                // Customer info
                customer_name: orderData.customerName,
                customer_email: orderData.customerEmail,

                // Order details
                order_id: orderData.orderId,
                order_date: orderData.orderDate,
                order_total: orderData.subtotal.toFixed(2),

                // Items
                order_items: this.formatItems(orderData.items),
                item_count: orderData.items.length,

                // Shipping
                shipping_address: this.formatShippingAddress(
                    orderData.shippingAddress
                ),

                // Email routing
                to_email: orderEmailConfig.adminEmail,
                reply_to: orderData.customerEmail,
            };

            // Use the same template but route to admin email
            await emailjs.send(
                emailConfig.serviceId,
                orderEmailConfig.orderTemplateId,
                templateParams
            );

            console.log('✅ Order notification email sent to admin');
            return true;
        } catch (error) {
            console.error('❌ Failed to send admin notification email:', error);
            return false;
        }
    }
}

// Export singleton instance
export const orderEmailService = new OrderEmailService();

// Export types
export type { OrderEmailData };
