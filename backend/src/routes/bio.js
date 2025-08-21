const express = require('express');
const router = express.Router();
const { getBio, updateBio } = require('../models/bio');

// Get bio
router.get('/', async (req, res) => {
    console.log('👥 Bio requested');
    try {
        const bio = await getBio();
        res.json({ success: true, bio });
    } catch (error) {
        console.error('❌ Failed to get bio:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve bio',
        });
    }
});

// Update bio (admin only)
router.put('/admin', async (req, res) => {
    const { password, ...bioData } = req.body;

    // Simple password protection
    if (password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const updatedBio = await updateBio(bioData);
        if (updatedBio) {
            console.log('👥 Bio updated successfully');
            res.json({ success: true, bio: updatedBio });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to update bio',
            });
        }
    } catch (error) {
        console.error('❌ Failed to update bio:', error);
        res.status(500).json({ success: false, error: 'Failed to update bio' });
    }
});

module.exports = router;
