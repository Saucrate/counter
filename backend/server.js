const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const counterRoutes = require('./routes/counter.js');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://counterf.onrender.com'],
    credentials: true
}));
app.use(express.json());

// Database connection with better error handling
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Error handling for MongoDB connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// After mongoose.connect()
mongoose.connection.once('open', async () => {
    try {
        console.log('MongoDB connection established');
        console.log('Connected to database:', mongoose.connection.db.databaseName);
        
        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        // Count documents in User collection
        const userCount = await mongoose.connection.db.collection('users').countDocuments();
        console.log('Number of users in database:', userCount);
        
        // List some users (for debugging)
        const users = await mongoose.connection.db.collection('users').find({}).limit(5).toArray();
        console.log('Sample users:', users.map(u => ({ username: u.username, email: u.email })));
        
    } catch (err) {
        console.error('Error checking database state:', err);
    }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/counter', counterRoutes);

// Add this after your routes
app.get('/api/test', async (req, res) => {
    try {
        // Test database connection
        const collections = await mongoose.connection.db.listCollections().toArray();
        const dbState = mongoose.connection.readyState;
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
        
        res.json({
            mongodb: {
                state: states[dbState],
                collections: collections.map(c => c.name),
                database: mongoose.connection.db.databaseName
            }
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Add this test route
app.post('/api/test/create-user', async (req, res) => {
    try {
        const User = mongoose.model('User');
        const testUser = new User({
            username: 'testuser' + Date.now(),
            password: 'hashedpassword',
            email: `test${Date.now()}@example.com`,
            firstName: 'Test',
            lastName: 'User'
        });
        
        await testUser.save();
        
        // Verify the user was created
        const savedUser = await User.findById(testUser._id);
        
        res.json({
            message: 'Test user created',
            user: savedUser,
            databaseName: mongoose.connection.db.databaseName,
            collectionName: User.collection.name
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
});
