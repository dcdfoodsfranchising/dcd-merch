/**
 * @file models/User.js
 * @description Mongoose schema and model for user accounts, including validation, email confirmation, 
 * login codes, admin flag, wishlist references, and more.
 * 
 * This model is responsible for storing all user-related information such as credentials, contact details, 
 * admin roles, and account verification status.
 */

const mongoose = require('mongoose');
const validator = require('validator');

// Define the schema for the User collection
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required']
        // Basic string input for user's first name
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required']
        // Basic string input for user's last name
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true, // Prevents duplicate usernames
        validate: [validator.isAlphanumeric, 'Username must be alphanumeric']
        // Ensures usernames contain only letters and numbers
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validator.isEmail, 'Invalid email format']
        // Ensures proper email formatting and uniqueness
    },
    password: {
        type: String,
        required: [true, 'Password is required']
        // This should be hashed before storing (via middleware or controller logic)
    },
    isAdmin: {
        type: Boolean,
        default: false
        // Indicates if the user has admin privileges
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile Number is required'],
        validate: [validator.isMobilePhone, 'Invalid mobile number']
        // Ensures the string is a valid mobile number
    },
    profilePicture: {
        type: String,
        required: false
        // Optional: Path or URL to profile image
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
        // Allows referencing products the user has added to their wishlist
    }],
    loginCode: {
        type: String,
        required: false
        // Optional: Used for login verification, e.g., 2FA or temporary code-based login
    },
    emailConfirmationCode: {
        type: String,
        required: false
        // Temporary token/code sent to the user's email for verification
    },
    emailConfirmationExpires: {
        type: Date,
        required: false
        // Sets an expiration time for the email confirmation token
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false
        // Indicates whether the user has verified their email address
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Export the User model if it doesn’t already exist (avoids re-registration errors in development)
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
