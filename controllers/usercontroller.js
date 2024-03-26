const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


// METHOD = POST
// Helps to signup user

const signUpUser = (req, res) => {

    console.log(req.body);
    if (req.body.password) {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (hash) {
                //create a new user 
                const NEW_USER = new User({
                    ...req.body,
                    password: hash
                });
                //store user in db
                NEW_USER.save().then(response => {
                    if (response._id) {
                        return res.status(200).json({
                            success: true,
                            message: "Account created successfully",
                        });
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: "Something went wrong",
                            error: err,
                        });
                    }
                }).catch((error) => {
                    res.status(500).json({
                        success: false,
                        error: error,
                    })
                })
            }
        })
    }

}

// METHOD = POST
// Helps to login user

const loginUser = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    // Get the data from request object
    try {
        const response = await User.findOne({ email });
        if (response && response._id) {
            bcrypt.compare(password, response.password).then(function (result) {
                if (result) {
                    // GENERATE JWT TOKEN AND SENT IT IN RESPONSE BODY
                    const token = jwt.sign({ role: ["user"] }, process.env.SECRET_KEY, {
                        expiresIn: 60 * 5,
                    });
                    res.cookie('token', token, { httpOnly: true, maxAge: 360000})
                    res.status(200).json({
                        success: true,
                        message: "User login successfull",
                        token: token,
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        message: "Email ID or Password is Incorrect"
                    });
                }
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User does not exist"
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        })
    }
}

// METHOD = POST
// Route for forgot-password

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    // Get email from request
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "User not registered",
            });
        } else {
            // generate token for reset password

            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
                expiresIn: '5m',
            });

            // using nodemailer send token to request gmail data

            const tranporter = nodemailer.createTransport({
                service: "Gmail",
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Reset Password',
                text: `http://localhost:3000/resetPassword/${token}`,
            };

            tranporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.json({ message: "error sending email" })
                } else {
                    return res.json({
                        success: true,
                        message: "Email sent"
                    })
                }
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        })
    }
}

// METHOD = POST
// Route for reset-password

const resetPassword = async (req, res) => {
    const token = req.params.token;
    // get token data from send email
    const { password } = req.body;
    // get password from request
    try {
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        //verify jwt token and decoding it
        const id = decoded.id;
        const hashpassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({ _id: id }, { password: hashpassword })
        return res.status(200).json({
            success: true,
            message: "Password updated"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        })
    }

}

// METHOD = GET
// Route for verify user

const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log(req.cookies.token);
        if (!token) {
            return res.json({
                success: false,
                message: "no token found"
            })
        }
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        })
    }
}

// METHOD = GET
// Route for logout user

const userLogout = async (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({
        success: true,
        message: "user logged out"
    })
}



module.exports = {
    signUpUser,
    loginUser,
    forgotPassword,
    resetPassword,
    verifyUser,
    userLogout

}