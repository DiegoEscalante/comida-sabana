require('dotenv').config(); //so that the .env can be loaded locally
const express = require('express');
const connectDB = require('./lib/connectDB')
const app = express();
const cookieParser = require('cookie-parser')


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})

connectDB();

app.use(express.json());
app.use(cookieParser());

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/s3', require('./routes/s3Routes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/rev', require('./routes/reviewRoutes'));
