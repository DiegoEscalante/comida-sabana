require('dotenv').config(); //so that the .env can be loaded locally
const express = require('express');
const connectDB = require('./lib/connectDB')
const app = express();
const cookieParser = require('cookie-parser')

if (require.main === module) {
    // Only run app.listen if this file is executed directly
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

connectDB();

app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/s3', require('./routes/s3Routes'));

module.exports = app; // Vercel uses this to use the Express app as handler for HTTP Requests