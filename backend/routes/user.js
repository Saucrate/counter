const express = require('express');
const { auth } = require('../middleware/auth.js');
const User = require('../models/User.js');

const router = express.Router();

// Get user profile
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user' });
    }
});

// Update user profile
router.put('/', auth, async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update allowed fields
        ['firstName', 'lastName', 'email'].forEach(field => {
            if (updates[field]) {
                user[field] = updates[field];
            }
        });

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

module.exports = router; 