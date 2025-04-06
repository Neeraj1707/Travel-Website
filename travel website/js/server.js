// server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

const packageRoutes = require('./routes/packages');
app.use('/api/packages', packageRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// models/Package.js
const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
});

module.exports = mongoose.model('Package', packageSchema);

// routes/packages.js
const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Get all packages
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new package
router.post('/', async (req, res) => {
    const package = new Package({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
    });

    try {
        const newPackage = await package.save();
        res.status(201).json(newPackage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;