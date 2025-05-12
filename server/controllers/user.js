const User = require('../Models/User');
const auth = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const cloudinary = require('../config/cloudinary'); // Assuming Cloudinary is used for image uploads
const axios = require('axios'); // For CAPTCHA verification
const sendEmail = require('../config/sendEmail'); // Utility for sending emails
const { errorHandler } = auth;

// Register User with Email Confirmation
module.exports.registerUser = async (req, res) => {
    try {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(req.body.password)) {
            return res.status(400).send({
                message: 'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.'
            });
        }

        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username is already taken. Please choose a different one.' });
        }

        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail && existingEmail.isEmailConfirmed) {
            return res.status(400).send({ message: 'Email is already registered and confirmed.' });
        }

        const confirmationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
        const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // Set expiration to 15 minutes from now

        // Send confirmation email before saving the user
        const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email?email=${req.body.email}&code=${confirmationCode}`;
        try {
            await sendEmail(
                req.body.email,
                "Email Confirmation",
                `Hello ${req.body.firstName},

Here is your new confirmation code:

Code: ${confirmationCode}

Link: ${confirmationLink}

Thank you!`
            );
        } catch (err) {
            return res.status(500).send({
                success: false,
                message: "Email could not be sent. Please try again later."
            });
        }

        // Save the user only after the email is successfully sent
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            mobileNo: req.body.mobileNo,
            emailConfirmationCode: confirmationCode, // Store the confirmation code
            emailConfirmationExpires: expirationTime, // Store the expiration time
            isEmailConfirmed: false // Email is not confirmed yet
        });

        await newUser.save();

        res.status(201).send({
            success: true,
            message: "Registered successfully. Please confirm your email to activate your account."
        });
    } catch (err) {
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];
            return res.status(400).send({ message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} is already taken. Please choose a different one.` });
        }
        res.status(500).send({ success: false, message: err.message });
    }
};

// Confirm Email
module.exports.confirmEmail = async (req, res) => {
    try {
        const { email, confirmationCode } = req.body;

        if (!email || !confirmationCode) {
            return res.status(400).send({ message: "Email and confirmation code are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.isEmailConfirmed) {
            return res.status(400).send({ message: "Email is already confirmed" });
        }

        if (user.emailConfirmationCode !== confirmationCode) {
            return res.status(400).send({ message: "Invalid confirmation code" });
        }

        if (user.emailConfirmationExpires < Date.now()) {
            return res.status(400).send({ message: "Confirmation code has expired. Please request a new code." });
        }

        user.isEmailConfirmed = true; // Mark email as confirmed
        user.emailConfirmationCode = null; // Clear the confirmation code
        user.emailConfirmationExpires = null; // Clear the expiration time
        await user.save();

        res.status(200).send({ message: "Email confirmed successfully. You can now log in." });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

module.exports.resendConfirmationCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.isEmailConfirmed) {
            return res.status(400).send({ message: "Email is already confirmed" });
        }

        const confirmationCode = Math.floor(100000 + Math.random() * 900000); // Generate a new 6-digit code
        const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // Set expiration to 15 minutes from now

        user.emailConfirmationCode = confirmationCode;
        user.emailConfirmationExpires = expirationTime;
        await user.save();

        // Send the new confirmation email
        const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email?email=${user.email}&code=${confirmationCode}`;
        await sendEmail(
            user.email,
            "Resend Email Confirmation Code",
            `Hello ${user.firstName},\n\nHere is your new confirmation code:\n\nCode: ${confirmationCode}\n\nLink: ${confirmationLink}\n\nThank you!`
        );

        res.status(200).send({ message: "Confirmation code resent successfully." });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

// Login User with CAPTCHA and Email Confirmation Check
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body;

        if (!email || !password || !captchaToken) {
            return res.status(400).send({ message: "Email, password, and CAPTCHA token are required" });
        }

        // Verify CAPTCHA
        const captchaSecret = process.env.CAPTCHA_SECRET_KEY;
        const captchaResponse = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: captchaSecret,
                    response: captchaToken
                }
            }
        );

        console.log("CAPTCHA Verification Response:", captchaResponse.data);

        // Check if CAPTCHA verification was successful
        if (!captchaResponse.data.success) {
            return res.status(400).send({ message: "CAPTCHA verification failed" });
        }

        // Check the score returned by reCAPTCHA v3
        const { score, action } = captchaResponse.data;
        if (score < 0.5 || action !== "login") {
            return res.status(400).send({ message: "Suspicious activity detected. CAPTCHA verification failed." });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({ error: "No email found" });
        }

        if (!user.isEmailConfirmed) {
            return res.status(403).send({ message: "Please confirm your email before logging in." });
        }

        // Check if the password is correct
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (isPasswordCorrect) {
            const accessToken = auth.createAccessToken(user); // Generate a JWT token for the user
            return res.status(200).send({
                message: "Login successful",
                accessToken,
                user: {
                    id: user._id,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    isAdmin: user.isAdmin
                }
            });
        } else {
            return res.status(401).send({ error: "Email and password do not match" });
        }
    } catch (err) {
        console.error("❌ Login Error:", err.message);
        return res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

// Verify Login Code
module.exports.verifyLoginCode = async (req, res) => {
    try {
        const { userId, loginCode } = req.body;

        if (!userId || !loginCode) {
            return res.status(400).send({ message: "User ID and login code are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (user.loginCode !== loginCode) {
            return res.status(400).send({ message: "Invalid login code" });
        }

        user.loginCode = null; // Clear the login code
        await user.save();

        const accessToken = auth.createAccessToken(user);

        res.status(200).send({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                username: user.username,
                profilePicture: user.profilePicture,
                isAdmin: user.isAdmin
            }
        });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

// Retrieve User Details
module.exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ user });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

// Update User as Admin
module.exports.updateUserAsAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        user.isAdmin = true;
        await user.save();

        res.status(200).send({ message: "User updated to admin successfully." });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

// Update Password
module.exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).send({ message: "Current password is incorrect" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).send({
                message: 'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.'
            });
        }

        user.password = bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.status(200).send({ message: "Password updated successfully." });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};

// Upload Profile Picture
module.exports.uploadProfilePicture = async (req, res) => {
    try {
      const file = req.file;
  
      if (!file) {
        console.log("No file uploaded");
        return res.status(400).send({ message: "No file uploaded" });
      }
  
      console.log("Uploaded file details:", file);
  
      const { path } = file; // Use 'path' instead of 'secure_url'
      console.log("Cloudinary URL (path):", path);
  
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePicture: path }, // Save 'path' as the profilePicture
        { new: true }
      );
  
      if (!user) {
        console.log("User not found");
        return res.status(404).send({ message: "User not found" });
      }
  
      console.log("Updated user:", user);
  
      res.status(200).send({
        message: "Profile picture uploaded successfully",
        profilePicture: user.profilePicture,
      });
    } catch (err) {
      console.error("Error uploading profile picture:", err.message);
      res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
  };

// Update Username
module.exports.updateUsername = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).send({ message: "Username is required" });
        }

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).send({ message: "Username is already taken" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { username },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({
            message: "Username updated successfully",
            username: user.username
        });
    } catch (err) {
        res.status(500).send({ message: "Internal Server Error", error: err.message });
    }
};


module.exports.updateUserDetails = async (req, res) => {
    try {
      const { firstName, lastName, mobileNo } = req.body;
  
      // Validate input
      if (!firstName || !lastName || !mobileNo) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Update user details
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id, // Assuming `req.user.id` contains the authenticated user's ID
        { firstName, lastName, mobileNo },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json({ message: "User details updated successfully.", user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred while updating user details." });
    }
  };