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

// Google OAuth Login (Redirects user to Google Sign-in)
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Route for initiating the Google OAuth consent screen
router.get("/google", 

	passport.authenticate('google', {
		// Scopes that are allowed when retriving user data
		scope: ['email', 'profile'],
		// Allows the OAuth consent screen to be "prompted" when the route is accessed to select a new account every time the user tries to login.
		// prompt: "select_account"
	})
)

// Route for the callback URL for Google OAuth authentication
router.get("/google/callback",
	passport.authenticate('google', {
		// If authentication is unsuccessful, redirect to "/users/failed" route
		failureRedirect: '/users/failed',
	}),
	// If authentication is successful, redirect to "/users/success" route
	function (req, res) {
		res.redirect('/users/success')
	}
)


// Route for failed authentication
router.get("/failed", (req, res) => {
	console.log('User is not authenticated');
	res.send("Failed")
})

// Route for successful authentication
router.get("/success", isLoggedIn, (req, res) => {
	console.log('You are logged in');
	console.log(req.user);
	res.send(`Welcome ${req.user.displayName}`)
})


// Route for logging out
router.get("/logout", (req, res) => {
	// Destroys the session that stores the Google OAuth Client credentials
    // Allows for release of resources when the account information is no longer needed in the browser
	req.session.destroy(err => {
		if(err) {
			console.log('Error while destroying the session: ', err)
		} else {
			req.logout(() => {
				console.log('You are logged out');
				res.redirect('/')
			})
		}
	})
})

module.exports = router;
