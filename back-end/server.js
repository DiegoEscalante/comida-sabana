const express = require('express');
const connectDB = require('.lib/connectDB')
const app = express();

connectDB();

app.use(express.json())

// Mount routes
app.use('/api/users', require('./routes/userRoutes'));