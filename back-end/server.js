const express = require('express');
const connectDB = require('./lib/connectDB')
const app = express();
console.log('MONGODB_URI: ', process.env.MONGODB_URI);
connectDB();

app.use(express.json());

// Mount routes
app.use('/api/users', require('./routes/userRoutes'));

module.exports = app; // Vercel uses this to use the Express app as handler for HTTP Requests