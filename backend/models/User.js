const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    counter: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    collection: 'users'
});

const User = mongoose.model('User', userSchema);
console.log('User model initialized with collection:', User.collection.name);

module.exports = User; 