/**
 * @file auth.js
 * @description Authentication & Authorization middleware using JWT for Node.js/Express.
 * Includes token creation, verification, role checks (admin/user), and centralized error handling.
 */

const jwt = require("jsonwebtoken");
require('dotenv').config();

/**
 * Creates a JWT access token for a user.
 * @param {Object} user - The user object (must include _id, email, isAdmin, and role).
 * @returns {String} - Signed JWT token with 1-hour expiration.
 */
module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
};

/**
 * Middleware to verify a JWT token.
 * Adds decoded user payload to `req.user` if valid.
 */
module.exports.verify = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer <token>"

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

/**
 * Middleware to check if user is authenticated (token is valid and decoded).
 * Requires `verify` to run before it in the middleware chain.
 */
module.exports.isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).send({ message: "Unauthorized: No valid token" });
    }
};

/**
 * Middleware to allow only admins.
 * Requires decoded token (via `verify`) to contain `isAdmin: true`.
 */
module.exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({ auth: "Failed", message: "Action Forbidden: Admins only" });
    }
};

/**
 * Middleware to allow only regular users (non-admin).
 */
module.exports.verifyUser = (req, res, next) => {
    console.log("Result from verifyUser:", req.user);

    if (req.user && !req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({ auth: "Failed", message: "Access denied: Users only" });
    }
};

/**
 * Centralized error handler.
 * Use this as the last middleware in your app to handle thrown or passed errors.
 */
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
