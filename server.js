require('dotenv').config(); //so that the .env can be loaded locally
const cors = require('cors');
const express = require('express');
const connectDB = require('./lib/connectDB')
const cookieParser = require('cookie-parser')

const app = express();
const PORT = process.env.PORT || 3000;


connectDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origin (como Postman) o si están en la lista
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));


// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/s3', require('./routes/s3Routes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/rev', require('./routes/reviewRoutes'));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
