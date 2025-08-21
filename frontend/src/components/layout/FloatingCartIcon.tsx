'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';

const FloatingCartIcon: React.FC = () => {
    const { getTotalItems, setIsCartOpen, isCartOpen } = useCart();
    const totalItems = getTotalItems();

    // Don't show the floating icon if the cart sidebar is open or if cart is empty
    if (isCartOpen || totalItems === 0) return null;

    return (
        <button
            onClick={() => setIsCartOpen(true)}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '60px',
                height: '60px',
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 1000,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}
        >
            {/* Cart Icon (using a simple SVG or unicode) */}
            <div
                style={{
                    color: '#fff',
                    fontSize: '1.5rem',
                    position: 'relative',
                }}
            >
                🛒
            </div>

            {/* Item Count Badge */}
            {totalItems > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#fff',
                        color: '#000',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: '2px solid #1a1a1a',
                    }}
                >
                    {totalItems > 99 ? '99+' : totalItems}
                </div>
            )}
        </button>
    );
};

export default FloatingCartIcon;
