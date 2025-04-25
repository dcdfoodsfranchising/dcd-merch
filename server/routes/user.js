const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../middlewares/auth");
const multer = require("../middlewares/multer"); // Middleware for handling file uploads

// User Registration with Email Confirmation
router.post("/register", userController.registerUser);

// Confirm Email
router.post("/confirm-email", userController.confirmEmail);

// Resend Confirmation Code
router.post("/resend-confirmation-code", userController.resendConfirmationCode);

// User Authentication with CAPTCHA
router.post("/login", userController.loginUser);

// Verify Login Code
router.post("/verify-login-code", userController.verifyLoginCode);

// Retrieve User Details
router.get("/details", verify, userController.getUserDetails);

// Update User as Admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin);

// Update Password
router.patch("/update-password", verify, userController.updatePassword);

// Upload Profile Picture
router.post(
    "/upload-profile-picture",
    verify,
    multer.single("file"), 
    userController.uploadProfilePicture
);

// Update Username
router.patch("/update-username", verify, userController.updateUsername);

module.exports = router;