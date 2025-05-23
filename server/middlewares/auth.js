const jwt = require("jsonwebtoken");
require('dotenv').config();

// Function to create access token
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "1h" }); // Added expiration
};

// Token verification middleware
module.exports.verify = (req, res, next) => {

    let token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).send({ auth: "Failed", message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
        if (err) {
            console.error("Token Verification Error:", err.message);
            return res.status(401).send({ auth: "Failed", message: "Invalid token" });
        }
        req.user = decodedToken;
        next();
    });
};

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).send({ message: "Unauthorized: No valid token" });
    }
};

// Middleware to verify if user is an admin
module.exports.verifyAdmin = (req, res, next) => {

    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({ auth: "Failed", message: "Action Forbidden: Admins only" });
    }
};

// Middleware to verify if user is a normal user (not admin)
module.exports.verifyUser = (req, res, next) => {
    console.log("Result from verifyUser:", req.user);

    if (req.user && !req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({ auth: "Failed", message: "Access denied: Users only" });
    }
};

// Central error handler
module.exports.errorHandler = (err, req, res, next) => {
    console.error("Error Handler:", err);

    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
            errorCode: err.code || "SERVER_ERROR",
            details: err.details || null
        }
    });
};
