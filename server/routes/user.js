const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

// User registration
router.post("/register", userController.registerUser);

// User authentication
router.post("/login", userController.loginUser);

// Retrieve user details
router.get("/details", verify, userController.getUserDetails);

// Update user as admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin);

// Update password
router.patch("/update-password", verify, userController.updatePassword);

// Google OAuth Login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard"); // Redirect after successful login (change to frontend URL)
  }
);

// Logout route
router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/"); // Redirect after logout
  });
});

// Get logged-in user details
router.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user); // Send user data
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

module.exports = router;
