const mongoose = require('mongoose');

// Check if the model is already defined
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First Name is required']
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
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
        required: [true, 'Mobile Number is required']
    },
    wishlist: [{
         type: mongoose.Schema.Types.ObjectId, 
         ref: "Product" 
    }]
}));

module.exports = User;
