const express = require('express');
const router = express.Router();
const {
    getAllLyrics,
    addSong,
    updateSong,
    deleteSong,
} = require('../models/lyrics');

// Get all lyrics
router.get('/', async (req, res) => {
    console.log('🎵 Lyrics requested');
    try {
        const lyrics = await getAllLyrics();
        res.json({ success: true, lyrics });
    } catch (error) {
        console.error('❌ Failed to get lyrics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve lyrics',
        });
    }
});

// Add new song (admin only)
router.post('/admin', async (req, res) => {
    const { password, ...songData } = req.body;

    if (password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Validate required fields
    if (!songData.title) {
        return res.status(400).json({
            success: false,
            error: 'Missing required field: title',
        });
    }

    try {
        const newSong = await addSong(songData);
        if (newSong) {
            console.log(`🎵 New song added: ${newSong.title}`);
            res.json({ success: true, song: newSong });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to create song',
            });
        }
    } catch (error) {
        console.error('❌ Failed to create song:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create song',
        });
    }
});

// Update existing song (admin only)
router.put('/admin/:id', async (req, res) => {
    const { id } = req.params;
    const { password, ...songData } = req.body;

    if (password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const updatedSong = await updateSong(id, songData);
        if (!updatedSong) {
            return res
                .status(404)
                .json({ success: false, error: 'Song not found' });
        }

        console.log(`🎵 Song updated: ${updatedSong.title}`);
        res.json({ success: true, song: updatedSong });
    } catch (error) {
        console.error('❌ Failed to update song:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update song',
        });
    }
});

// Delete song (admin only)
router.delete('/admin/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const deletedSong = await deleteSong(id);
        if (!deletedSong) {
            return res
                .status(404)
                .json({ success: false, error: 'Song not found' });
        }

        console.log(`🎵 Song deleted: ${deletedSong.title}`);
        res.json({ success: true, deletedSong });
    } catch (error) {
        console.error('❌ Failed to delete song:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete song',
        });
    }
});

module.exports = router;
