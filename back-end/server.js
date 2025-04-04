const express = require('express');
const connectDB = require('.lib/connectDB')
const app = express();

connectDB();

app.use(express.json());

// Mount routes
app.use('/api/users', require('./routes/userRoutes'));

module.exports = app; // Vercel uses this to use the Express app as handler for HTTP Requests