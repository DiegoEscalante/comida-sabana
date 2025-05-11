const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token){
        return res.status(401).json({ error: 'Access token missing. '});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded; //Attach decoded payload to user so it can be accessed by other functions
        next(); //Continue to next middleware 
    } catch(error){
        return res.status(401).json({error:'Invalid or expired token'});
    }
};
module.exports = authenticate;