'use client';

import React, { useEffect, useRef } from 'react';
import { performanceOptimizer } from '../../utils/performance';

interface OrderConfirmationProps {
    isOpen: boolean;
    orderId: string | null;
    onClose: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
    isOpen,
    orderId,
    onClose,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Focus management
    useEffect(() => {
        if (isOpen && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Auto-close after 60 seconds with user notification
    useEffect(() => {
        if (!isOpen) return;

        const timeoutId = performanceOptimizer.scheduleTask(() => {
            onClose();
        }, 60000); // Increased to 60 seconds for better visibility

        return timeoutId;
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-description"
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
                zIndex: 2000,
                padding: '1rem',
            }}
            onClick={handleOverlayClick}
        >
            <div
                ref={modalRef}
                className="confirmation-content"
                style={{
                    backgroundColor: 'rgba(20, 20, 20, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    maxWidth: '500px',
                    width: '95%',
                    padding: '3rem 2rem',
                    position: 'relative',
                    textAlign: 'center',
                    color: '#fff',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    aria-label="Close order confirmation"
                    title="Close confirmation (Escape)"
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
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor =
                            'rgba(255, 255, 255, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor =
                            'rgba(255, 255, 255, 0.3)';
                    }}
                >
                    ×
                </button>

                {/* Success Icon */}
                <div
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        border: '3px solid #4CAF50',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem auto',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            width: '24px',
                            height: '12px',
                            borderLeft: '3px solid #4CAF50',
                            borderBottom: '3px solid #4CAF50',
                            transform: 'rotate(-45deg)',
                            marginTop: '-6px',
                        }}
                    />
                </div>

                {/* Content */}
                <h2
                    id="confirmation-title"
                    style={{
                        fontSize: '1.8rem',
                        fontWeight: '300',
                        marginBottom: '1rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: '#4CAF50',
                    }}
                >
                    Order Confirmed!
                </h2>

                <div id="confirmation-description">
                    <p
                        style={{
                            fontSize: '1rem',
                            lineHeight: '1.6',
                            marginBottom: '1.5rem',
                            opacity: '0.9',
                        }}
                    >
                        Thank you for your purchase! Your order has been
                        successfully processed.
                    </p>

                    {orderId && (
                        <div
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                padding: '1rem',
                                marginBottom: '2rem',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '0.9rem',
                                    opacity: '0.7',
                                    marginBottom: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                Order ID:
                            </p>
                            <p
                                style={{
                                    fontSize: '1rem',
                                    fontFamily: 'monospace',
                                    color: '#4CAF50',
                                    wordBreak: 'break-all',
                                }}
                            >
                                {orderId}
                            </p>
                        </div>
                    )}

                    <p
                        style={{
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            opacity: '0.8',
                            marginBottom: '2rem',
                        }}
                    >
                        You will receive a confirmation email shortly with your
                        order details and tracking information.
                    </p>
                </div>

                {/* Continue Shopping Button */}
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: '1px solid #4CAF50',
                        color: '#4CAF50',
                        padding: '1rem 2rem',
                        fontSize: '0.9rem',
                        fontWeight: '300',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease',
                        minWidth: '200px',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                            'rgba(76, 175, 80, 0.1)';
                        e.currentTarget.style.borderColor = '#66BB6A';
                        e.currentTarget.style.color = '#66BB6A';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = '#4CAF50';
                        e.currentTarget.style.color = '#4CAF50';
                    }}
                >
                    Continue Shopping
                </button>

                {/* Auto-close notification */}
                <p
                    style={{
                        fontSize: '0.8rem',
                        opacity: '0.6',
                        marginTop: '1.5rem',
                        fontStyle: 'italic',
                    }}
                >
                    This dialog will close automatically in 60 seconds
                </p>

                {/* Screen reader announcement */}
                <div
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                    style={{
                        position: 'absolute',
                        left: '-10000px',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden',
                    }}
                >
                    Order confirmation: Your purchase was successful. Order ID{' '}
                    {orderId}. A confirmation email will be sent shortly.
                </div>
            </div>

            {/* Styles */}
            <style>
                {`
                    .sr-only {
                        position: absolute !important;
                        width: 1px !important;
                        height: 1px !important;
                        padding: 0 !important;
                        margin: -1px !important;
                        overflow: hidden !important;
                        clip: rect(0, 0, 0, 0) !important;
                        white-space: nowrap !important;
                        border: 0 !important;
                    }

                    @media (max-width: 480px) {
                        .confirmation-content {
                            padding: 2rem 1.5rem !important;
                            margin: 1rem !important;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .confirmation-content,
                        .confirmation-content button,
                        .confirmation-content * {
                            transition: none !important;
                            animation: none !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default OrderConfirmation;
