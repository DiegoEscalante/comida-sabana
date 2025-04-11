require('dotenv').config(); //so that it can be loaded locally
const express = require('express');
const connectDB = require('./lib/connectDB')
const app = express();

connectDB();

app.use(express.json());

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));

module.exports = app; // Vercel uses this to use the Express app as handler for HTTP Requests