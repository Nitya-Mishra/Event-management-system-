const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

// Create an event
router.post('/', async (req, res) => {
    const { title, description, date } = req.body;
    try {
        const newEvent = await Event.create({ title, description, date });
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: 'Error creating event' });
    }
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

// RSVP to an event
router.post('/:id/rsvp', async (req, res) => {
    const { userId } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        if (!event.attendees.includes(userId)) {
            event.attendees.push(userId);
            await event.save();
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: 'Error RSVPing to event' });
    }
});

module.exports = router;
