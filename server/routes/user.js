const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../middlewares/auth");

// User Registration
router.post("/register", userController.registerUser);

// User Authentication
router.post("/login", userController.loginUser);

// Retrieve User Details
router.get("/details", verify, userController.getUserDetails);

// Update User as Admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin);

// Update Password
router.patch("/update-password", verify, userController.updatePassword);

module.exports = router;
