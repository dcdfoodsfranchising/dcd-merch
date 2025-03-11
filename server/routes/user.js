const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const passport = require("passport");
const { verify, verifyAdmin } = require("../auth");

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

// Google OAuth Login (Redirects user to Google Sign-in)
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route (Handles Google response)
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/"); 
    }
);

// Logout route
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.redirect("/"); // Redirect to home page after logout
        });
    });
});

module.exports = router;
