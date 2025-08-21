import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { orderEmailService } from '../../services/orderEmailService';

const Success: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const [emailStatus, setEmailStatus] = useState<string>('');

    useEffect(() => {
        const processOrder = async () => {
            // Get session ID from URL params
            const sessionId = searchParams.get('session_id');
            console.log('🎉 Payment successful! Session ID:', sessionId);

            if (sessionId) {
                try {
                    // Fetch order details from our backend
                    setEmailStatus('Fetching order details...');
                    console.log('📧 Fetching order details...');

                    const response = await fetch(
                        `http://localhost:3000/api/process-order/${sessionId}`
                    );
                    const result = await response.json();

                    if (result.success) {
                        console.log(
                            '✅ Order details fetched, sending emails...'
                        );
                        setEmailStatus('Sending confirmation emails...');

                        // Update inventory for purchased items
                        console.log('📦 Updating server inventory...');
                        setEmailStatus('Updating inventory...');

                        // Decrement inventory for each purchased item via server
                        for (const item of result.orderData.items) {
                            try {
                                const response = await fetch(
                                    'http://localhost:3000/api/inventory/decrement',
                                    {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            itemId: item.id,
                                            size: item.size || null,
                                            quantity: item.quantity,
                                        }),
                                    }
                                );

                                const inventoryResult = await response.json();
                                if (inventoryResult.success) {
                                    console.log(
                                        `📦 Server inventory updated: ${
                                            item.id
                                        }${
                                            item.size ? ` (${item.size})` : ''
                                        } -${item.quantity}`
                                    );
                                } else {
                                    console.error(
                                        `❌ Failed to update server inventory for ${item.id}:`,
                                        inventoryResult.error
                                    );
                                }
                            } catch (error) {
                                console.error(
                                    `❌ Network error updating inventory for ${item.id}:`,
                                    error
                                );
                            }
                        }

                        // Send admin notification email from frontend
                        console.log('📧 Sending admin email...');
                        setEmailStatus('Sending confirmation emails...');

                        const adminResult =
                            await orderEmailService.sendAdminNotification(
                                result.orderData
                            );

                        if (adminResult) {
                            console.log('✅ Admin email sent successfully');
                            setEmailStatus('Order processed successfully!');
                        } else {
                            console.error('❌ Admin email failed');
                            setEmailStatus('Order processed (email failed)');
                        }
                    } else {
                        console.error(
                            '❌ Failed to fetch order details:',
                            result.error
                        );
                        setEmailStatus('Failed to fetch order details');
                    }
                } catch (error) {
                    console.error('❌ Error processing order:', error);
                    setEmailStatus('Email sending failed');
                }
            }

            // Clear the cart after successful payment
            console.log('🛒 Clearing cart after successful payment...');
            clearCart();
            console.log('✅ Cart cleared');

            // Redirect to home after 8 seconds (more time to see email status)
            const timer = setTimeout(() => {
                navigate('/');
            }, 8000);

            return () => clearTimeout(timer);
        };

        processOrder();
    }, [clearCart, navigate, searchParams]);

    return (
        <div
            style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                textAlign: 'center',
                color: '#fff',
            }}
        >
            <h1
                style={{
                    fontSize: '2rem',
                    marginBottom: '1rem',
                    fontWeight: '300',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                }}
            >
                Thank You For Your Order!
            </h1>

            <p
                style={{
                    fontSize: '1.1rem',
                    marginBottom: '2rem',
                    maxWidth: '600px',
                    lineHeight: '1.6',
                }}
            >
                Your payment was successful and your order is being processed.
                You'll receive a confirmation email shortly with your order
                details.
            </p>

            {emailStatus && (
                <p
                    style={{
                        fontSize: '1rem',
                        marginBottom: '2rem',
                        color: emailStatus.includes('sent')
                            ? '#4CAF50'
                            : '#FFA726',
                        fontWeight: '500',
                    }}
                >
                    {emailStatus}
                </p>
            )}

            <p
                style={{
                    fontSize: '0.9rem',
                    color: '#aaa',
                }}
            >
                You'll be redirected to the home page in a few seconds...
            </p>
        </div>
    );
};

export default Success;
