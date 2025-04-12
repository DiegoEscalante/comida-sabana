const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) { //If the user role doesn't match any of the authorized roles
            console.error("Authorized roles:", roles);
            console.error("User role from token:", req.user?.role);
            return res.status(403).json({ error: 'Access denied: insufficient permissions.'});
        }
        next();
    };
};

module.exports = authorize;