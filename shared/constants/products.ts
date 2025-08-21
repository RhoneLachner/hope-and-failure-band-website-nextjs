// Shared product constants

export const PRODUCT_IDS = {
    JUDITH_SHIRT: 'judith-shirt',
    JUDITH_TOTE: 'judith-tote',
} as const;

export const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export const PRICE_IDS = {
    [PRODUCT_IDS.JUDITH_SHIRT]: 'price_1Q9KtWJJSLJOjqcUBOJY5Rzj',
    [PRODUCT_IDS.JUDITH_TOTE]: 'price_1Q9KuNJJSLJOjqcUcnvSHuGV',
} as const;

export type ProductId = (typeof PRODUCT_IDS)[keyof typeof PRODUCT_IDS];
export type ShirtSize = (typeof SHIRT_SIZES)[number];
