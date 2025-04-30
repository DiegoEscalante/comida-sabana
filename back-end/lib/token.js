const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId,
        }, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'}
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user._id},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:'30d'}
    )
}

module.exports = {generateAccessToken, generateRefreshToken};