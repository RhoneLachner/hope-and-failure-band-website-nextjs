'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import OrderConfirmation from '../forms/OrderConfirmation';
import StripeCheckout from '../forms/StripeCheckout';

const CartSidebar: React.FC = () => {
    const {
        items,
        removeFromCart,
        updateQuantity,
        getSubtotal,
        isCartOpen,
        setIsCartOpen,
        checkout,
        isLoading,
    } = useCart();

    const [openQuantityDropdown, setOpenQuantityDropdown] = useState<
        string | null
    >(null);
    const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);
    const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
    const [showStripeCheckout, setShowStripeCheckout] = useState(false);

    // Always render but use animations to show/hide

    const handleQuantityChange = (
        itemId: string,
        newQuantity: number,
        size?: string
    ) => {
        updateQuantity(itemId, newQuantity, size);
    };

    const handleCheckout = async () => {
        if (items.length === 0) {
            return;
        }

        // Open Stripe checkout instead of processing immediately
        setShowStripeCheckout(true);
    };

    const handleStripeSuccess = (orderId: string) => {
        // Show order confirmation
        setLastOrderId(orderId);
        setShowOrderConfirmation(true);
        setShowStripeCheckout(false);
        setIsCartOpen(false); // Close cart sidebar
    };

    const handleStripeClose = () => {
        setShowStripeCheckout(false);
    };

    const handleContinueShopping = () => {
        setIsCartOpen(false);
    };

    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 2000,
                    opacity: isCartOpen ? 1 : 0,
                    transition: 'opacity 0.6s ease-out',
                    pointerEvents: isCartOpen ? 'auto' : 'none',
                }}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Cart Sidebar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '400px',
                    maxWidth: '90vw',
                    height: '100vh',
                    backgroundColor: '#1a1a1a',
                    zIndex: 2001,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.3)',
                    transform: isCartOpen
                        ? 'translateX(0)'
                        : 'translateX(100%)',
                    transition:
                        'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    pointerEvents: isCartOpen ? 'auto' : 'none',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '1.5rem 1.5rem 1rem 1.5rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <h2
                        style={{
                            color: '#fff',
                            fontSize: '1.5rem',
                            fontWeight: '300',
                            margin: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                        }}
                    >
                        Your cart
                    </h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        style={{
                            background: 'none',
                            border: '1px solid #fff',
                            borderRadius: '0',
                            color: '#fff',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            width: '2rem',
                            height: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0',
                            paddingBottom: '3px',
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Cart Items */}
                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '0',
                    }}
                >
                    {items.length === 0 ? (
                        <div
                            style={{
                                padding: '2rem 1.5rem',
                                textAlign: 'center',
                                color: 'rgba(255, 255, 255, 0.6)',
                            }}
                        >
                            Your cart is empty
                        </div>
                    ) : (
                        items.map((item) => {
                            const itemKey = `${item.id}-${
                                item.size || 'no-size'
                            }`;
                            return (
                                <div
                                    key={itemKey}
                                    style={{
                                        padding: '1.5rem',
                                        borderBottom:
                                            '1px solid rgba(255, 255, 255, 0.1)',
                                        display: 'flex',
                                        gap: '1rem',
                                    }}
                                >
                                    {/* Item Image */}
                                    <div
                                        style={{
                                            width: '80px',
                                            height: '80px',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </div>

                                    {/* Item Details */}
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        {/* Item Name */}
                                        <h3
                                            style={{
                                                color: '#fff',
                                                fontSize: '0.9rem',
                                                fontWeight: '400',
                                                margin: 0,
                                                lineHeight: '1.3',
                                            }}
                                        >
                                            {item.title}
                                        </h3>

                                        {/* Size */}
                                        {item.size && (
                                            <div
                                                style={{
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                    fontSize: '0.8rem',
                                                }}
                                            >
                                                Size: {item.size}
                                            </div>
                                        )}

                                        {/* Quantity and Remove */}
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                marginTop: 'auto',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        position: 'relative',
                                                        width: '66px',
                                                    }}
                                                >
                                                    <div
                                                        onClick={() => {
                                                            const dropdownKey = `${
                                                                item.id
                                                            }-${
                                                                item.size ||
                                                                'no-size'
                                                            }`;
                                                            setOpenQuantityDropdown(
                                                                openQuantityDropdown ===
                                                                    dropdownKey
                                                                    ? null
                                                                    : dropdownKey
                                                            );
                                                        }}
                                                        style={{
                                                            background:
                                                                'rgba(255, 255, 255, 0.1)',
                                                            border: '1px solid rgba(255, 255, 255, 0.3)',
                                                            borderRadius: '4px',
                                                            color: '#fff',
                                                            padding:
                                                                '0.3rem 0.5rem',
                                                            fontSize: '0.8rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            justifyContent:
                                                                'space-between',
                                                            alignItems:
                                                                'center',
                                                            userSelect: 'none',
                                                        }}
                                                    >
                                                        <span>
                                                            {item.quantity}
                                                        </span>
                                                        <span
                                                            style={{
                                                                transform:
                                                                    openQuantityDropdown ===
                                                                    `${
                                                                        item.id
                                                                    }-${
                                                                        item.size ||
                                                                        'no-size'
                                                                    }`
                                                                        ? 'rotate(180deg)'
                                                                        : 'rotate(0deg)',
                                                                transition:
                                                                    'transform 0.2s ease',
                                                                fontSize:
                                                                    '0.6rem',
                                                            }}
                                                        >
                                                            ▼
                                                        </span>
                                                    </div>
                                                    {openQuantityDropdown ===
                                                        `${item.id}-${
                                                            item.size ||
                                                            'no-size'
                                                        }` && (
                                                        <div
                                                            style={{
                                                                position:
                                                                    'absolute',
                                                                top: '100%',
                                                                left: 0,
                                                                right: 0,
                                                                background:
                                                                    'rgba(26, 26, 26, 0.95)',
                                                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                                                borderTop:
                                                                    'none',
                                                                borderRadius:
                                                                    '0 0 4px 4px',
                                                                zIndex: 3000,
                                                                boxShadow:
                                                                    '0 4px 6px rgba(0, 0, 0, 0.3)',
                                                                maxHeight:
                                                                    '120px',
                                                                overflowY:
                                                                    'auto',
                                                            }}
                                                        >
                                                            {[1, 2, 3].map(
                                                                (num) => (
                                                                    <div
                                                                        key={
                                                                            num
                                                                        }
                                                                        onClick={() => {
                                                                            handleQuantityChange(
                                                                                item.id,
                                                                                num,
                                                                                item.size
                                                                            );
                                                                            setOpenQuantityDropdown(
                                                                                null
                                                                            );
                                                                        }}
                                                                        style={{
                                                                            padding:
                                                                                '0.3rem 0.5rem',
                                                                            color: '#fff',
                                                                            cursor: 'pointer',
                                                                            fontSize:
                                                                                '0.8rem',
                                                                            backgroundColor:
                                                                                item.quantity ===
                                                                                num
                                                                                    ? 'rgba(255, 255, 255, 0.1)'
                                                                                    : 'transparent',
                                                                            transition:
                                                                                'background-color 0.1s ease',
                                                                        }}
                                                                        onMouseEnter={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                item.quantity !==
                                                                                num
                                                                            ) {
                                                                                e.currentTarget.style.backgroundColor =
                                                                                    'rgba(255, 255, 255, 0.05)';
                                                                            }
                                                                        }}
                                                                        onMouseLeave={(
                                                                            e
                                                                        ) => {
                                                                            if (
                                                                                item.quantity !==
                                                                                num
                                                                            ) {
                                                                                e.currentTarget.style.backgroundColor =
                                                                                    'transparent';
                                                                            }
                                                                        }}
                                                                    >
                                                                        {num}
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        removeFromCart(
                                                            item.id,
                                                            item.size
                                                        )
                                                    }
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: 'rgba(255, 255, 255, 0.6)',
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer',
                                                        textDecoration:
                                                            'underline',
                                                        padding: '0',
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <div
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                $
                                                {(
                                                    item.price * item.quantity
                                                ).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div
                        style={{
                            padding: '1.5rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            backgroundColor: '#1a1a1a',
                        }}
                    >
                        {/* Subtotal */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                                color: '#fff',
                                fontSize: '1.1rem',
                                fontWeight: '500',
                            }}
                        >
                            <span>Subtotal</span>
                            <span>${getSubtotal().toFixed(2)}</span>
                        </div>

                        {/* Buttons */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                            }}
                        >
                            <button
                                onClick={handleCheckout}
                                disabled={items.length === 0}
                                aria-label={`Checkout ${items.length} item${
                                    items.length !== 1 ? 's' : ''
                                } for $${getSubtotal()}`}
                                style={{
                                    background:
                                        items.length === 0
                                            ? 'rgba(255, 255, 255, 0.5)'
                                            : '#fff',
                                    color:
                                        items.length === 0
                                            ? 'rgba(0, 0, 0, 0.5)'
                                            : '#000',
                                    border: '1px solid #fff',
                                    padding: '0.75rem 1.5rem',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    cursor:
                                        items.length === 0
                                            ? 'not-allowed'
                                            : 'pointer',
                                    borderRadius: '0',
                                    width: '100%',
                                    transition: 'all 0.2s ease',
                                    position: 'relative',
                                }}
                                onMouseEnter={(e) => {
                                    if (items.length > 0) {
                                        e.currentTarget.style.backgroundColor =
                                            'rgba(255, 255, 255, 0.9)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (items.length > 0) {
                                        e.currentTarget.style.backgroundColor =
                                            '#fff';
                                    }
                                }}
                            >
                                {items.length === 0
                                    ? 'Cart Empty'
                                    : `Secure Checkout ($${getSubtotal()})`}
                            </button>

                            <button
                                onClick={handleContinueShopping}
                                style={{
                                    background: 'none',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.5rem',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    textAlign: 'center',
                                }}
                            >
                                Continue shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Stripe Checkout Modal */}
            <StripeCheckout
                isOpen={showStripeCheckout}
                onClose={handleStripeClose}
                onSuccess={handleStripeSuccess}
            />

            {/* Order Confirmation Modal */}
            <OrderConfirmation
                isOpen={showOrderConfirmation}
                orderId={lastOrderId}
                onClose={() => {
                    setShowOrderConfirmation(false);
                    setLastOrderId(null);
                }}
            />
        </>
    );
};

export default CartSidebar;
