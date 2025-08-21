import {
    securityConfig,
    security,
    SecurityError,
    SecurityErrorType,
} from '../config/security';
import type { CartItem } from '../context/CartContext';

interface Product {
    id: string;
    title: string;
    price: number;
    sizes?: string[];
    inventory: Record<string, number>; // size -> quantity available
}

interface CartValidationResult {
    valid: boolean;
    errors: string[];
    updatedItems?: CartItem[];
}

interface InventoryCheckResult {
    available: boolean;
    maxQuantity: number;
    message?: string;
}

interface OrderResult {
    success: boolean;
    orderId?: string;
    error?: string;
}

// Default product inventory (reset values)
const DEFAULT_PRODUCTS: Record<string, Product> = {
    'judith-shirt': {
        id: 'judith-shirt',
        title: 'HOPE & FAILURE\nJUDITH PRINT SHIRT',
        price: 0.5,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        inventory: {
            XS: 0,
            S: 5,
            M: 15,
            L: 20,
            XL: 8,
            XXL: 5,
            XXXL: 0,
        },
    },
    'judith-tote': {
        id: 'judith-tote',
        title: 'HOPE & FAILURE\nJUDITH PRINT TOTE',
        price: 0.5,
        inventory: {
            default: 15, // No sizes for tote bags
        },
    },
};

// Load inventory from localStorage or use defaults
const loadInventoryFromStorage = (): Record<string, Product> => {
    try {
        if (typeof window === 'undefined') return { ...DEFAULT_PRODUCTS };

        const stored = localStorage.getItem('hope-failure-inventory');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Validate structure and merge with defaults
            const result: Record<string, Product> = {};

            Object.keys(DEFAULT_PRODUCTS).forEach((id) => {
                const defaultProduct = DEFAULT_PRODUCTS[id];
                const storedProduct = parsed[id];

                if (storedProduct && storedProduct.inventory) {
                    result[id] = {
                        ...defaultProduct,
                        inventory: {
                            ...defaultProduct.inventory,
                            ...storedProduct.inventory,
                        },
                    };
                } else {
                    result[id] = { ...defaultProduct };
                }
            });

            return result;
        }
    } catch (error) {
        console.warn(
            'Failed to load inventory from storage, using defaults:',
            error
        );
    }

    return { ...DEFAULT_PRODUCTS };
};

// Save inventory to localStorage
const saveInventoryToStorage = (products: Record<string, Product>): void => {
    try {
        if (typeof window === 'undefined') return;

        // Only save inventory data, not full product data
        const inventoryOnly: Record<
            string,
            { inventory: Record<string, number> }
        > = {};
        Object.keys(products).forEach((id) => {
            inventoryOnly[id] = { inventory: products[id].inventory };
        });

        localStorage.setItem(
            'hope-failure-inventory',
            JSON.stringify(inventoryOnly)
        );
    } catch (error) {
        console.warn('Failed to save inventory to storage:', error);
    }
};

// Simulated product database - in production, this would come from your backend
let PRODUCTS = loadInventoryFromStorage();

// TEMPORARY: Force reset to defaults (remove this line after testing)
// PRODUCTS = { ...DEFAULT_PRODUCTS };

class CartAPI {
    private requestCount = 0;
    private requestWindow = Date.now();

    private checkRateLimit(): void {
        const now = Date.now();
        if (now - this.requestWindow > securityConfig.rateLimit.windowMs) {
            this.requestCount = 0;
            this.requestWindow = now;
        }

        if (!security.rateLimit.isAllowed(this.requestCount)) {
            throw new SecurityError(
                SecurityErrorType.RATE_LIMIT_EXCEEDED,
                'Too many requests. Please try again later.'
            );
        }

        this.requestCount++;
    }

    async validateCartItems(items: CartItem[]): Promise<CartValidationResult> {
        this.checkRateLimit();

        const errors: string[] = [];
        const updatedItems: CartItem[] = [];

        for (const item of items) {
            try {
                // Validate item exists
                const product = PRODUCTS[item.id];
                if (!product) {
                    errors.push(`Product ${item.id} not found`);
                    continue;
                }

                // Validate price
                if (!security.validatePrice(item.price, product.price)) {
                    errors.push(`Invalid price for ${product.title}`);
                    continue;
                }

                // Validate size if applicable
                if (product.sizes && item.size) {
                    if (!product.sizes.includes(item.size)) {
                        errors.push(
                            `Invalid size ${item.size} for ${product.title}`
                        );
                        continue;
                    }
                }

                // Check inventory
                const inventoryCheck = await this.checkInventory(item);
                if (!inventoryCheck.available) {
                    errors.push(
                        inventoryCheck.message ||
                            `${product.title} is out of stock`
                    );
                    continue;
                }

                // Adjust quantity if needed
                const adjustedQuantity = Math.min(
                    item.quantity,
                    inventoryCheck.maxQuantity
                );
                if (adjustedQuantity !== item.quantity) {
                    errors.push(
                        `Only ${adjustedQuantity} of ${product.title} available`
                    );
                }

                updatedItems.push({
                    ...item,
                    quantity: adjustedQuantity,
                });
            } catch (error) {
                errors.push(
                    `Error validating ${item.title}: ${
                        error instanceof Error ? error.message : 'Unknown error'
                    }`
                );
            }
        }

        return {
            valid: errors.length === 0,
            errors,
            updatedItems: errors.length > 0 ? updatedItems : undefined,
        };
    }

    async checkInventory(item: CartItem): Promise<InventoryCheckResult> {
        this.checkRateLimit();

        const product = PRODUCTS[item.id];
        if (!product) {
            return {
                available: false,
                maxQuantity: 0,
                message: 'Product not found',
            };
        }

        const sizeKey = item.size || 'default';
        const availableStock = product.inventory[sizeKey] || 0;

        return {
            available: availableStock > 0,
            maxQuantity: availableStock,
            message: availableStock === 0 ? `Out of stock` : undefined,
        };
    }

    async getProduct(id: string): Promise<Product | null> {
        this.checkRateLimit();
        return PRODUCTS[id] || null;
    }

    async getAllProducts(): Promise<Product[]> {
        this.checkRateLimit();
        return Object.values(PRODUCTS);
    }

    // Simulate updating inventory (in production, this would be a backend operation)
    async updateInventory(
        itemId: string,
        size: string | undefined,
        quantityChange: number
    ): Promise<void> {
        const product = PRODUCTS[itemId];
        if (product) {
            const sizeKey = size || 'default';
            if (product.inventory[sizeKey] !== undefined) {
                const oldQuantity = product.inventory[sizeKey];
                const newQuantity = Math.max(0, oldQuantity - quantityChange);
                product.inventory[sizeKey] = newQuantity;

                // Log inventory change for debugging
                console.log(
                    `📦 Inventory Update: ${itemId}${
                        size ? ` (${size})` : ''
                    }: ${oldQuantity} → ${newQuantity} (-${quantityChange})`
                );

                // Persist inventory changes to localStorage
                saveInventoryToStorage(PRODUCTS);
            }
        }
    }

    // Reset inventory to default values (for demo/testing purposes)
    async resetInventory(): Promise<void> {
        PRODUCTS = { ...DEFAULT_PRODUCTS };
        saveInventoryToStorage(PRODUCTS);
    }

    // Get current inventory levels
    async getInventoryStatus(): Promise<
        Record<string, Record<string, number>>
    > {
        const inventoryStatus: Record<string, Record<string, number>> = {};
        Object.keys(PRODUCTS).forEach((id) => {
            inventoryStatus[id] = { ...PRODUCTS[id].inventory };
        });
        return inventoryStatus;
    }

    // Create a secure checkout session
    async createCheckoutSession(
        items: CartItem[]
    ): Promise<{ sessionId: string; totalAmount: number }> {
        this.checkRateLimit();

        // Validate cart before creating session
        const validation = await this.validateCartItems(items);
        if (!validation.valid) {
            throw new SecurityError(
                SecurityErrorType.INVALID_CART_ITEM,
                `Cart validation failed: ${validation.errors.join(', ')}`
            );
        }

        // Calculate total amount server-side
        let totalAmount = 0;
        for (const item of items) {
            const product = PRODUCTS[item.id];
            if (product) {
                totalAmount += product.price * item.quantity;
            }
        }

        // In production, this would create a Stripe checkout session
        const sessionId = `cs_${security.generateNonce()}`;

        return {
            sessionId,
            totalAmount,
        };
    }

    // Process order completion (mock Stripe webhook handler)
    async completeOrder(
        sessionId: string,
        items: CartItem[]
    ): Promise<OrderResult> {
        this.checkRateLimit();

        try {
            // Final validation before completing order
            const validation = await this.validateCartItems(items);
            if (!validation.valid) {
                return {
                    success: false,
                    error: `Order validation failed: ${validation.errors.join(
                        ', '
                    )}`,
                };
            }

            // Check inventory one final time
            for (const item of items) {
                const inventoryCheck = await this.checkInventory(item);
                if (
                    !inventoryCheck.available ||
                    item.quantity > inventoryCheck.maxQuantity
                ) {
                    return {
                        success: false,
                        error: `Insufficient inventory for ${item.title}${
                            item.size ? ` (${item.size})` : ''
                        }`,
                    };
                }
            }

            // Update inventory (decrement stock)
            for (const item of items) {
                await this.updateInventory(item.id, item.size, item.quantity);
            }

            // Generate order ID
            const orderId = `order_${Date.now()}_${security
                .generateNonce()
                .slice(0, 8)}`;

            // In production, this would:
            // 1. Save order to database
            // 2. Send confirmation email
            // 3. Update analytics
            // 4. Trigger fulfillment process

            return {
                success: true,
                orderId,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : 'Order processing failed',
            };
        }
    }

    // Mock payment processing (simulates Stripe payment)
    async processPayment(
        sessionId: string,
        paymentMethodId: string = 'pm_mock'
    ): Promise<{ success: boolean; paymentIntentId?: string; error?: string }> {
        this.checkRateLimit();

        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock payment success (90% success rate for demo)
        const success = Math.random() > 0.1;

        if (success) {
            return {
                success: true,
                paymentIntentId: `pi_${security.generateNonce()}`,
            };
        } else {
            return {
                success: false,
                error: 'Payment failed. Please try a different payment method.',
            };
        }
    }
}

// Export singleton instance
export const cartAPI = new CartAPI();

// Debug helper for browser console
if (typeof window !== 'undefined') {
    (window as any).checkInventory = async () => {
        const inventory = await cartAPI.getInventoryStatus();
        console.table(inventory);
        return inventory;
    };

    (window as any).resetInventory = async () => {
        await cartAPI.resetInventory();
        console.log('🔄 Inventory reset to defaults');
        return await cartAPI.getInventoryStatus();
    };
}

// Export types
export type { Product, CartValidationResult, InventoryCheckResult };
