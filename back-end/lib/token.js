const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        }, process.env.JWT_ACCESS_SECRET, {expiresIn: '1h'}
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn:'30d'}
    )
}

module.exports = {generateAccessToken, generateRefreshToken};