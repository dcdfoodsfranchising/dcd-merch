const User = require('../Models/User');
const auth = require('../auth')
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const { errorHandler } = auth;

module.exports.registerUser = (req, res) => {

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")) {
        return res.status(400).send({ message: 'Invalid email format' });
    }

    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length !== 11) {
        return res.status(400).send({ message: 'Mobile number is invalid' });
    }

    // Checks if the password has at least 8 characters
    else if (req.body.password.length < 8) {
        return res.status(400).send({ message: 'Password must be at least 8 characters long' });
    } else {

        // Check if user already exists
        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user) {
                    return res.status(400).send({ message: 'User already exists' });
                } else {
                    // Create a new user
                    let newUser = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, 10), // 10 salt rounds
                        mobileNo: req.body.mobileNo
                    });
                    // Save the new user to the database
                    return newUser.save()
                    .then(() => res.status(201).send({ success: true, message: "Registered Successfully" }))
                    .catch(err => res.status(500).send({ success: false, message: err.message }));

                }
            })
            .catch(err => res.status(500).send({ message: err.message }));
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: 'Email and password are required' });
        }

        if (!email.includes("@")) {
            return res.status(400).send({ message: 'Invalid email' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).send({ error: 'No email found' });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if (isPasswordCorrect) {
            return res.status(201).send({ 
                accessToken: auth.createAccessToken(user),
                user: { // ✅ Include user details
                    _id: user._id,
                    email: user.email,
                    isAdmin: user.isAdmin // ✅ Ensure isAdmin is included
                }
            });
        } else {
            return res.status(401).send({ error: 'Email and password do not match' });
        }
    } catch (err) {
        return errorHandler(err, req, res);
    }
};



module.exports.getUserDetails = (req, res) => {
    if (!req.user) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    User.findById(req.user.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }

            user.password = ""; 
            return res.status(200).send({ 
                user: user 
            });
        })
        .catch(err => errorHandler(err, req, res));
};

// Update user as admin
module.exports.updateUserAsAdmin = (req, res) => {
    if (!req.user) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(500).send({
            error: "Failed in Find",
            details: {
                stringValue: `"${req.params.id}"`,
                valueType: typeof req.params.id,
                kind: "ObjectId",
                value: req.params.id,
                path: "_id",
                reason: {},
                name: "CastError",
                message: `Cast to ObjectId failed for value "${req.params.id}" (type ${typeof req.params.id}) at path "_id" for model "User"`
            }
        });
    }

    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            user.isAdmin = true;
            return user.save();
        })
        .then(updatedUser => {
            return res.status(200).send({
                updatedUser: {
                    _id: updatedUser._id,
                    isAdmin: updatedUser.isAdmin,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    mobileNo: updatedUser.mobileNo,
                    password: updatedUser.password // Include hashed password if needed
                }
            });
        })
        .catch(err => errorHandler(err, req, res));
};

// Update user password
module.exports.updatePassword = (req, res) => {
    const { user, newPassword } = req.body;

    User.findById(user)
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: 'User not found' });
            }
            user.password = newPassword; // Ensure you hash the password before saving
            return user.save();
        })
        .then(() => {
            return res.status(200).send({
                message: "Password reset successfully"
            });
        })
        .catch(err => errorHandler(err, req, res));
};
