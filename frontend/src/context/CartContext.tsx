'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { cartAPI, type CartValidationResult } from '../services/cart';
import { security, SecurityError } from '../config/security';

export interface CartItem {
    id: string;
    title: string;
    price: number;
    size?: string;
    quantity: number;
    image: string;
}

interface CartError {
    type: 'validation' | 'inventory' | 'security' | 'network';
    message: string;
    timestamp: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<boolean>;
    removeFromCart: (id: string, size?: string) => void;
    updateQuantity: (
        id: string,
        quantity: number,
        size?: string
    ) => Promise<boolean>;
    clearCart: () => void;
    getTotalItems: () => number;
    getSubtotal: () => number;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    validateCart: () => Promise<CartValidationResult>;
    errors: CartError[];
    clearErrors: () => void;
    isLoading: boolean;
    checkout: () => Promise<{
        success: boolean;
        orderId?: string;
        error?: string;
    }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [errors, setErrors] = useState<CartError[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('hope-failure-cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                setItems(parsedCart);
                // Validate cart on load
                validateCart().then((result) => {
                    if (!result.valid && result.updatedItems) {
                        setItems(result.updatedItems);
                    }
                });
            }
        } catch (error) {
            console.error('Failed to load cart from localStorage:', error);
            addError('validation', 'Failed to load saved cart');
        }
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        try {
            localStorage.setItem('hope-failure-cart', JSON.stringify(items));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
            addError('validation', 'Failed to save cart');
        }
    }, [items]);

    const addError = useCallback((type: CartError['type'], message: string) => {
        const error: CartError = {
            type,
            message,
            timestamp: Date.now(),
        };
        setErrors((prev) => [...prev.slice(-4), error]); // Keep last 5 errors
    }, []);

    const clearErrors = useCallback(() => {
        setErrors([]);
    }, []);

    const validateCart =
        useCallback(async (): Promise<CartValidationResult> => {
            if (items.length === 0) {
                return { valid: true, errors: [] };
            }

            try {
                const result = await cartAPI.validateCartItems(items);
                if (!result.valid) {
                    result.errors.forEach((error) =>
                        addError('validation', error)
                    );
                }
                return result;
            } catch (error) {
                const message =
                    error instanceof SecurityError
                        ? error.message
                        : 'Failed to validate cart';
                addError('security', message);
                return { valid: false, errors: [message] };
            }
        }, [items, addError]);

    const addToCart = useCallback(
        async (item: Omit<CartItem, 'quantity'>): Promise<boolean> => {
            setIsLoading(true);
            try {
                // Sanitize inputs
                const sanitizedItem = {
                    ...item,
                    title: security.sanitizeInput(item.title),
                    id: security.sanitizeInput(item.id),
                    size: item.size
                        ? security.sanitizeInput(item.size)
                        : undefined,
                };

                // Check inventory before adding
                const inventoryCheck = await cartAPI.checkInventory({
                    ...sanitizedItem,
                    quantity: 1,
                });
                if (!inventoryCheck.available) {
                    addError(
                        'inventory',
                        inventoryCheck.message || 'Item out of stock'
                    );
                    return false;
                }

                setItems((prevItems) => {
                    const existingItemIndex = prevItems.findIndex(
                        (cartItem) =>
                            cartItem.id === sanitizedItem.id &&
                            cartItem.size === sanitizedItem.size
                    );

                    if (existingItemIndex >= 0) {
                        const updatedItems = [...prevItems];
                        const newQuantity =
                            updatedItems[existingItemIndex].quantity + 1;

                        if (newQuantity > inventoryCheck.maxQuantity) {
                            addError(
                                'inventory',
                                `Only ${inventoryCheck.maxQuantity} items available`
                            );
                            return prevItems;
                        }

                        updatedItems[existingItemIndex].quantity = newQuantity;
                        return updatedItems;
                    } else {
                        return [
                            ...prevItems,
                            { ...sanitizedItem, quantity: 1 },
                        ];
                    }
                });

                setIsCartOpen(true);
                return true;
            } catch (error) {
                const message =
                    error instanceof SecurityError
                        ? error.message
                        : 'Failed to add item to cart';
                addError('network', message);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [addError]
    );

    const removeFromCart = useCallback((id: string, size?: string) => {
        setItems((prevItems) =>
            prevItems.filter((item) => !(item.id === id && item.size === size))
        );
    }, []);

    const updateQuantity = useCallback(
        async (
            id: string,
            quantity: number,
            size?: string
        ): Promise<boolean> => {
            if (quantity <= 0) {
                removeFromCart(id, size);
                return true;
            }

            setIsLoading(true);
            try {
                // Find the item to check inventory
                const cartItem = items.find(
                    (item) => item.id === id && item.size === size
                );
                if (!cartItem) {
                    addError('validation', 'Item not found in cart');
                    return false;
                }

                const inventoryCheck = await cartAPI.checkInventory(cartItem);
                if (quantity > inventoryCheck.maxQuantity) {
                    addError(
                        'inventory',
                        `Only ${inventoryCheck.maxQuantity} items available`
                    );
                    return false;
                }

                setItems((prevItems) =>
                    prevItems.map((item) =>
                        item.id === id && item.size === size
                            ? { ...item, quantity }
                            : item
                    )
                );
                return true;
            } catch (error) {
                const message =
                    error instanceof SecurityError
                        ? error.message
                        : 'Failed to update quantity';
                addError('network', message);
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [items, addError, removeFromCart]
    );

    const clearCart = useCallback(() => {
        console.log('🛒 clearCart called - clearing items and localStorage');
        setItems([]);
        clearErrors();

        // Explicitly clear localStorage
        try {
            localStorage.removeItem('hope-failure-cart');
            console.log('✅ localStorage cleared');
        } catch (error) {
            console.error('❌ Failed to clear localStorage:', error);
        }
    }, [clearErrors]);

    const getTotalItems = useCallback(() => {
        return items.reduce((total, item) => total + item.quantity, 0);
    }, [items]);

    const getSubtotal = useCallback(() => {
        return items.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    }, [items]);

    const checkout = useCallback(async (): Promise<{
        success: boolean;
        orderId?: string;
        error?: string;
    }> => {
        if (items.length === 0) {
            return { success: false, error: 'Cart is empty' };
        }

        console.log('🛒 Starting checkout process with items:', items);
        setIsLoading(true);
        clearErrors();

        try {
            // Step 1: Create checkout session
            console.log('💳 Creating checkout session...');
            const session = await cartAPI.createCheckoutSession(items);
            console.log('✅ Checkout session created:', session.sessionId);

            // Step 2: Process payment (mock)
            console.log('💰 Processing payment...');
            const payment = await cartAPI.processPayment(session.sessionId);

            if (!payment.success) {
                console.error('❌ Payment failed:', payment.error);
                addError('network', payment.error || 'Payment failed');
                return { success: false, error: payment.error };
            }
            console.log(
                '✅ Payment processed successfully:',
                payment.paymentIntentId
            );

            // Step 3: Complete order (this decrements inventory)
            console.log('📦 Completing order and updating inventory...');
            const order = await cartAPI.completeOrder(session.sessionId, items);

            if (order.success) {
                console.log('🎉 Order completed successfully:', order.orderId);
                // Clear cart on successful order
                clearCart();
                return { success: true, orderId: order.orderId };
            } else {
                console.error('❌ Order completion failed:', order.error);
                addError('inventory', order.error || 'Order completion failed');
                return { success: false, error: order.error };
            }
        } catch (error) {
            console.error('💥 Checkout error:', error);
            const message =
                error instanceof SecurityError
                    ? error.message
                    : 'Checkout failed. Please try again.';
            addError('network', message);
            return { success: false, error: message };
        } finally {
            setIsLoading(false);
        }
    }, [items, addError, clearErrors, clearCart]);

    const value: CartContextType = {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getSubtotal,
        isCartOpen,
        setIsCartOpen,
        validateCart,
        errors,
        clearErrors,
        isLoading,
        checkout,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};
