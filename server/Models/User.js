const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        validate: [validator.isAlphanumeric, 'Username must be alphanumeric']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validator.isEmail, 'Invalid email format']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile Number is required'],
        validate: [validator.isMobilePhone, 'Invalid mobile number']
    },
    profilePicture: {
        type: String,
        required: false
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    loginCode: {
        type: String,
        required: false // Temporary field for login confirmation
    },
    emailConfirmationCode: {
        type: String,
        required: false // Temporary field for email confirmation
    },
    emailConfirmationExpires: {
        type: Date,
        required: false // Expiration time for the confirmation code
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false // Email is not confirmed by default
    }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);