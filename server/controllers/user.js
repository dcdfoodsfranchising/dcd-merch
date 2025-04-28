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

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send({ message: 'User already exists' });
        }

        const confirmationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
        const expirationTime = new Date(Date.now() + 15 * 60 * 1000); // Set expiration to 15 minutes from now

        // Send confirmation email before saving the user
        const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email?email=${req.body.email}&code=${confirmationCode}`;
        try {
            await sendEmail(
                req.body.email,
                "Email Confirmation",
                `Hello ${req.body.firstName},\n\nPlease confirm your email by using the code below or clicking the link:\n\nCode: ${confirmationCode}\n\nLink: ${confirmationLink}\n\nThank you!`
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

        if (!captchaResponse.data.success) {
            return res.status(400).send({ message: "CAPTCHA verification failed" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({ error: "No email found" });
        }

        if (!user.isEmailConfirmed) {
            return res.status(403).send({ message: "Please confirm your email before logging in." });
        }

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
            return res.status(400).send({ message: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(file.path);

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profilePicture: result.secure_url },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({
            message: "Profile picture uploaded successfully",
            profilePicture: user.profilePicture
        });
    } catch (err) {
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