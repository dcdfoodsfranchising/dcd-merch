const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");
const { verify, verifyAdmin } = require("../auth");

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

// 🔹 Google OAuth Login (Redirects user to Google Sign-in)
router.get("/auth/google", (req, res, next) => {
    console.log("🔹 Google OAuth Login Initiated");
    next();
}, passport.authenticate("google", { scope: ["profile", "email"] }));

// 🔹 Google Callback Route (Handles Google Response)
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }), // Redirect to login page if failed
    (req, res) => {
        console.log("✅ Google OAuth Success:", req.user);
        
        if (!req.user) {
            console.error("❌ Google OAuth Failed - No user returned");
            return res.status(500).json({ error: "Authentication failed" });
        }

        // Persist session
        req.session.user = req.user;
        
        res.redirect("/dashboard"); // Redirect to dashboard after successful login
    }
);

// 🔹 Logout Route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            console.log("✅ User Logged Out");
            res.redirect("/");
        });
    });
});

module.exports = router;
