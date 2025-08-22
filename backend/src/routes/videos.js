const express = require('express');
const router = express.Router();
const {
    getAllVideos,
    addVideo,
    updateVideo,
    deleteVideo,
} = require('../models/videos');
const { requireAdmin, adminRateLimit } = require('../middleware/auth');

// Get all videos
router.get('/', async (req, res) => {
    console.log('📹 Videos requested');
    try {
        const videos = await getAllVideos();
        res.json({ success: true, videos });
    } catch (error) {
        console.error('❌ Failed to get videos:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve videos',
        });
    }
});

// Update existing video (admin only)
router.put('/admin/:id', async (req, res) => {
    const { id } = req.params;
    const { password, ...videoData } = req.body;

    // Simple password protection
    if (password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const updatedVideo = await updateVideo(id, videoData);
        if (!updatedVideo) {
            return res
                .status(404)
                .json({ success: false, error: 'Video not found' });
        }

        console.log(`📹 Video updated: ${updatedVideo.title}`);
        res.json({ success: true, video: updatedVideo });
    } catch (error) {
        console.error('❌ Failed to update video:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update video',
        });
    }
});

// Add new video (admin only)
router.post('/admin', adminRateLimit, requireAdmin, async (req, res) => {
    const videoData = req.body; // Password already extracted by requireAdmin

    // Validate required fields
    if (!videoData.youtubeId || !videoData.title) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: youtubeId, title',
        });
    }

    try {
        const newVideo = await addVideo(videoData);
        if (newVideo) {
            console.log(`📹 New video added: ${newVideo.title}`);
            res.json({ success: true, video: newVideo });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to create video',
            });
        }
    } catch (error) {
        console.error('❌ Failed to create video:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create video',
        });
    }
});

// Delete video (admin only)
router.delete('/admin/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const deletedVideo = await deleteVideo(id);
        if (!deletedVideo) {
            return res
                .status(404)
                .json({ success: false, error: 'Video not found' });
        }

        console.log(`📹 Video deleted: ${deletedVideo.title}`);
        res.json({ success: true, deletedVideo });
    } catch (error) {
        console.error('❌ Failed to delete video:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete video',
        });
    }
});

module.exports = router;
