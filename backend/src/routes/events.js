const express = require('express');
const router = express.Router();
const {
    getAllEvents,
    addEvent,
    updateEvent,
    deleteEvent,
} = require('../models/events');

// Get all events
router.get('/', async (req, res) => {
    console.log('📅 Events requested');
    try {
        const events = await getAllEvents();
        res.json({ success: true, events });
    } catch (error) {
        console.error('❌ Failed to get events:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve events',
        });
    }
});

// Add new event (admin only)
router.post('/admin', async (req, res) => {
    const { password, ...eventData } = req.body;

    // Simple password protection
    if (password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Validate required fields
    if (
        !eventData.title ||
        !eventData.date ||
        !eventData.venue ||
        !eventData.location
    ) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: title, date, venue, location',
        });
    }

    try {
        const newEvent = await addEvent(eventData);
        if (newEvent) {
            console.log(`📅 New event added: ${newEvent.title}`);
            res.json({ success: true, event: newEvent });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to create event',
            });
        }
    } catch (error) {
        console.error('❌ Failed to create event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create event',
        });
    }
});

// Update existing event (admin only)
router.put('/admin/:id', async (req, res) => {
    const { id } = req.params;
    const { password, ...eventData } = req.body;

    // Simple password protection
    if (password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const updatedEvent = await updateEvent(id, eventData);
        if (!updatedEvent) {
            return res
                .status(404)
                .json({ success: false, error: 'Event not found' });
        }

        console.log(`📅 Event updated: ${updatedEvent.title}`);
        res.json({ success: true, event: updatedEvent });
    } catch (error) {
        console.error('❌ Failed to update event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update event',
        });
    }
});

// Delete event (admin only)
router.delete('/admin/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (password !== 'admin123') {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        const deletedEvent = await deleteEvent(id);
        if (!deletedEvent) {
            return res
                .status(404)
                .json({ success: false, error: 'Event not found' });
        }

        console.log(`📅 Event deleted: ${deletedEvent.title}`);
        res.json({ success: true, deletedEvent });
    } catch (error) {
        console.error('❌ Failed to delete event:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete event',
        });
    }
});

module.exports = router;
