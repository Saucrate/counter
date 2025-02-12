const express = require('express');
const { auth } = require('../middleware/auth.js');
const User = require('../models/User.js');

const router = express.Router();

// Get counter value
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.json({ count: user.counter });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching counter' });
    }
});

// Increase counter
router.post('/increase', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        user.counter += 1;
        await user.save();
        res.json({ count: user.counter });
    } catch (err) {
        res.status(500).json({ message: 'Error updating counter' });
    }
});

// Decrease counter
router.post('/decrease', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        user.counter -= 1;
        await user.save();
        res.json({ count: user.counter });
    } catch (err) {
        res.status(500).json({ message: 'Error updating counter' });
    }
});

module.exports = router; 