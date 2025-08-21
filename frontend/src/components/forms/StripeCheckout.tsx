'use client';

import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../../context/CartContext';
import { stripeConfig } from '../../config/stripe';

// Initialize Stripe with configuration
const stripePromise = loadStripe(stripeConfig.publishableKey);

interface StripeCheckoutProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (orderId: string) => void;
}

const CheckoutForm: React.FC<{
    onSuccess: (orderId: string) => void;
    onClose: () => void;
}> = ({ onClose }) => {
    const { items, getSubtotal } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // Create checkout session
            const response = await fetch(
                '/api/create-checkout-session',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items,
                        customerEmail: email,
                    }),
                }
            );

            const { url } = await response.json();

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (err) {
            console.error('Checkout error:', err);
            setError('Failed to start checkout. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {/* Customer Email */}
            <div style={{ marginBottom: '2rem' }}>
                <h3
                    style={{
                        color: '#fff',
                        marginBottom: '1rem',
                        fontSize: '1.2rem',
                        fontWeight: '300',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}
                >
                    Contact Information
                </h3>

                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '0.9rem',
                        }}
                    />
                    <p
                        style={{
                            color: '#aaa',
                            fontSize: '0.8rem',
                            marginTop: '0.5rem',
                        }}
                    >
                        You'll receive order confirmation and shipping updates
                        at this email.
                    </p>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div
                    style={{
                        color: '#ff6b6b',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                        textAlign: 'center',
                    }}
                >
                    {error}
                </div>
            )}

            {/* Order Summary */}
            <div
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '2rem',
                }}
            >
                <h4
                    style={{
                        color: '#fff',
                        marginBottom: '0.5rem',
                        fontSize: '1rem',
                    }}
                >
                    Order Summary
                </h4>
                <div style={{ color: '#ccc', fontSize: '0.9rem' }}>
                    {items.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.25rem',
                            }}
                        >
                            <span>
                                {item.title} {item.size ? `(${item.size})` : ''}{' '}
                                × {item.quantity}
                            </span>
                            <span>
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                    <hr
                        style={{
                            border: 'none',
                            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                            margin: '0.5rem 0',
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: 'bold',
                            color: '#fff',
                        }}
                    >
                        <span>Total:</span>
                        <span>${getSubtotal().toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        flex: 1,
                        padding: '1rem',
                        backgroundColor: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                    }}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                        flex: 2,
                        padding: '1rem',
                        backgroundColor: '#4CAF50',
                        border: 'none',
                        color: '#fff',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        opacity: isProcessing ? 0.7 : 1,
                    }}
                >
                    {isProcessing
                        ? 'Redirecting to Checkout...'
                        : `Checkout $${getSubtotal().toFixed(2)}`}
                </button>
            </div>
        </form>
    );
};

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 3000,
                padding: '1rem',
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                style={{
                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    maxWidth: '600px',
                    width: '95%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    padding: '2rem',
                    position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        color: '#fff',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    ×
                </button>

                {/* Header */}
                <h2
                    style={{
                        color: '#fff',
                        marginBottom: '2rem',
                        fontSize: '1.5rem',
                        fontWeight: '300',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        textAlign: 'center',
                    }}
                >
                    Secure Checkout
                </h2>

                {/* Stripe Elements Provider */}
                <Elements stripe={stripePromise}>
                    <CheckoutForm onSuccess={onSuccess} onClose={onClose} />
                </Elements>
            </div>
        </div>
    );
};

export default StripeCheckout;
