'use client';

import React, { useEffect } from 'react';

interface CartError {
    type: 'validation' | 'inventory' | 'security' | 'network';
    message: string;
    timestamp: number;
}

interface ErrorToastProps {
    errors: CartError[];
    onClearError: (timestamp: number) => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ errors, onClearError }) => {
    const latestError = errors[errors.length - 1];

    useEffect(() => {
        if (latestError) {
            // Use requestIdleCallback for better performance if available
            const scheduleCallback = (callback: () => void, delay: number) => {
                if ('requestIdleCallback' in window) {
                    const timeoutId = setTimeout(() => {
                        requestIdleCallback(callback, { timeout: 100 });
                    }, delay);
                    return () => clearTimeout(timeoutId);
                } else {
                    const timeoutId = setTimeout(callback, delay);
                    return () => clearTimeout(timeoutId);
                }
            };

            const cleanup = scheduleCallback(() => {
                onClearError(latestError.timestamp);
            }, 5000);

            return cleanup;
        }
    }, [latestError, onClearError]);

    if (!latestError) return null;

    const getErrorIcon = (type: CartError['type']) => {
        switch (type) {
            case 'validation':
                return '⚠️';
            case 'inventory':
                return '📦';
            case 'security':
                return '🔒';
            case 'network':
                return '🌐';
            default:
                return '❌';
        }
    };

    const getErrorTitle = (type: CartError['type']) => {
        switch (type) {
            case 'validation':
                return 'Validation Error';
            case 'inventory':
                return 'Inventory Issue';
            case 'security':
                return 'Security Error';
            case 'network':
                return 'Network Error';
            default:
                return 'Error';
        }
    };

    return (
        <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className="error-toast"
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: '#d32f2f',
                color: '#fff',
                padding: '1rem',
                borderRadius: '4px',
                maxWidth: '300px',
                zIndex: 10000,
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                animation: 'slideInRight 0.3s ease-out',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                }}
            >
                <span
                    style={{
                        fontSize: '1.2rem',
                        lineHeight: 1,
                    }}
                    aria-hidden="true"
                >
                    {getErrorIcon(latestError.type)}
                </span>
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            marginBottom: '0.25rem',
                        }}
                    >
                        {getErrorTitle(latestError.type)}
                    </div>
                    <div
                        style={{
                            fontSize: '0.85rem',
                            lineHeight: 1.4,
                        }}
                    >
                        {latestError.message}
                    </div>
                </div>
                <button
                    onClick={() => onClearError(latestError.timestamp)}
                    aria-label="Close error message"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        lineHeight: 1,
                        padding: '0',
                        marginLeft: '0.5rem',
                    }}
                >
                    ×
                </button>
            </div>

            <style>
                {`
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        @keyframes slideInRight {
                            from {
                                opacity: 0;
                            }
                            to {
                                opacity: 1;
                            }
                        }
                    }

                    @media (max-width: 480px) {
                        .error-toast {
                            right: 10px !important;
                            left: 10px !important;
                            max-width: none !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default ErrorToast;
