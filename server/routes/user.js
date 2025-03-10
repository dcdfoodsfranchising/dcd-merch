const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { verify, verifyAdmin, isLoggedIn } = require("../auth");


// User registration
router.post('/register', userController.registerUser);

// User authentication
router.post('/login', userController.loginUser);

// Retrieve user details
router.get('/details', verify,  userController.getUserDetails);

// Update user as admin
router.patch('/:id/set-as-admin', verify, verifyAdmin, userController.updateUserAsAdmin);

// Update password
router.patch('/update-password', verify, userController.updatePassword);






module.exports = router;