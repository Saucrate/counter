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
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.counter += 1;
        await user.save();
        console.log('Counter increased:', user.counter); // Debug log
        res.json({ count: user.counter });
    } catch (err) {
        console.error('Error increasing counter:', err);
        res.status(500).json({ message: 'Error updating counter' });
    }
});

// Decrease counter
router.post('/decrease', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.counter -= 1;
        await user.save();
        console.log('Counter decreased:', user.counter); // Debug log
        res.json({ count: user.counter });
    } catch (err) {
        console.error('Error decreasing counter:', err);
        res.status(500).json({ message: 'Error updating counter' });
    }
});

module.exports = router; 