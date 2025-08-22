const express = require('express');
const router = express.Router();
const {
    getInventory,
    updateInventory,
    decrementInventory,
} = require('../models/inventory');
const { requireAdmin, adminRateLimit } = require('../middleware/auth');

// Get inventory
router.get('/', async (req, res) => {
    console.log('📋 Inventory requested');
    try {
        const inventory = await getInventory();
        res.json({ success: true, inventory });
    } catch (error) {
        console.error('❌ Failed to get inventory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve inventory',
        });
    }
});

// Update inventory (admin only)
router.put('/admin', adminRateLimit, requireAdmin, async (req, res) => {
    const { productId, size, quantity } = req.body; // Password already extracted by requireAdmin

    if (!productId || !size || quantity === undefined) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: productId, size, quantity',
        });
    }

    try {
        const updated = await updateInventory(productId, size, quantity);
        if (updated) {
            console.log(
                `🔧 Admin updated inventory: ${productId} (${size}): ${quantity}`
            );
            const inventory = await getInventory();
            res.json({ success: true, inventory });
        } else {
            res.status(404).json({
                success: false,
                error: 'Product not found',
            });
        }
    } catch (error) {
        console.error('❌ Failed to update inventory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update inventory',
        });
    }
});

// Decrement inventory (used during purchases)
router.post('/decrement', async (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid items data',
        });
    }

    try {
        console.log('📦 Updating inventory for items:', items);
        console.log('🔄 Starting inventory update process...');

        const results = [];
        for (const item of items) {
            const { id, size, quantity } = item;
            const result = await decrementInventory(
                id,
                size || 'one-size',
                quantity
            );
            if (result) {
                results.push(result);
            }
        }

        console.log('✅ Inventory update process completed');
        res.json({ success: true, updates: results });
    } catch (error) {
        console.error('❌ Failed to decrement inventory:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update inventory',
        });
    }
});

module.exports = router;
