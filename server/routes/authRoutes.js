const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();


// =====================================================
// EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Check email configuration
transporter.verify(function (error, success) {

    if (error) {

        console.log("EMAIL CONFIG ERROR:", error);

    } else {

        console.log("EMAIL SERVER IS READY");

    }

});


// =====================================================
// USER REGISTER
// =====================================================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const cleanEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const user = new User({

            name: name,

            email: cleanEmail,

            password: hashedPassword,

            role: "user"

        });

        await user.save();

        res.status(201).json({

            message: "Registration successful"

        });

    } catch (error) {

        console.log("Registration Error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

});


// =====================================================
// NORMAL USER LOGIN
// =====================================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                message: "Email and password are required"

            });

        }

        const cleanEmail = email.toLowerCase().trim();

        const user = await User.findOne({

            email: cleanEmail

        });

        if (!user) {

            return res.status(401).json({

                message: "Invalid email or password"

            });

        }

        const passwordMatch = await bcrypt.compare(

            password,

            user.password

        );

        if (!passwordMatch) {

            return res.status(401).json({

                message: "Invalid email or password"

            });

        }

        const token = jwt.sign(

            {

                id: user._id.toString(),

                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "7d"

            }

        );

        return res.status(200).json({

            message: "Login successful",

            token: token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.log("Login Error:", error);

        return res.status(500).json({

            message: "Server error"

        });

    }

});

// =====================================================
// FORGOT PASSWORD - SEND OTP
// =====================================================

router.post("/forgot-password", async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({
                message: "Email is required"
            });

        }

        const cleanEmail =
            email.toLowerCase().trim();


        // Find user
        const user = await User.findOne({

            email: cleanEmail

        });


        if (!user) {

            return res.status(404).json({

                message:
                    "No account found with this email"

            });

        }


        // Generate 6 digit OTP
        const otp = Math.floor(

            100000 + Math.random() * 900000

        ).toString();


        // OTP expires after 10 minutes
        const expiresAt = new Date(

            Date.now() + 10 * 60 * 1000

        );


        // Delete old OTP
        await PasswordReset.deleteMany({

            email: cleanEmail

        });


        // Save new OTP
        await PasswordReset.create({

            email: cleanEmail,

            otp: otp,

            expiresAt: expiresAt

        });


        // Send OTP email
        await transporter.sendMail({

            from:
                `"JanSudhar" <${process.env.EMAIL_USER}>`,

            to: cleanEmail,

            subject:
                "JanSudhar - Password Reset OTP",

            html: `

                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 520px;
                    margin: 30px auto;
                    padding: 30px;
                    border: 1px solid #ddd;
                    border-radius: 12px;
                    background: #ffffff;
                ">

                    <h2 style="
                        color: #2563eb;
                    ">
                        JanSudhar
                    </h2>

                    <h3>
                        Password Reset Request
                    </h3>

                    <p>
                        Hello <b>${user.name}</b>,
                    </p>

                    <p>
                        We received a request to reset
                        your CivicAI account password.
                    </p>

                    <p>
                        Your One-Time Password (OTP) is:
                    </p>

                    <div style="
                        text-align: center;
                        margin: 25px 0;
                    ">

                        <span style="
                            display: inline-block;
                            padding: 15px 25px;
                            background: #eff6ff;
                            color: #2563eb;
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            border-radius: 8px;
                        ">
                            ${otp}
                        </span>

                    </div>

                    <p>
                        This OTP is valid for
                        <b>10 minutes</b>.
                    </p>

                    <p>
                        Do not share this OTP with anyone.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <hr>

                    <p style="
                        color: #666;
                        font-size: 13px;
                    ">
                        Regards,<br>
                        <b>CivicAI Team</b>
                    </p>

                </div>

            `

        });


        return res.status(200).json({

            message:
                "OTP sent successfully to your registered email"

        });


    } catch (error) {

        console.log(
            "Forgot Password Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to send OTP. Please try again."

        });

    }

});
// =====================================================
// VERIFY OTP
// =====================================================

router.post("/verify-otp", async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!email || !otp) {

            return res.status(400).json({
                message: "Email and OTP are required"
            });

        }

        const cleanEmail = email.toLowerCase().trim();

        // Find OTP
        const resetData = await PasswordReset.findOne({
            email: cleanEmail,
            otp: otp.toString().trim()
        });

        if (!resetData) {

            return res.status(400).json({
                message: "Invalid OTP"
            });

        }

        // Check OTP expiry
        if (new Date() > resetData.expiresAt) {

            await PasswordReset.deleteOne({
                _id: resetData._id
            });

            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP."
            });

        }

        // OTP is correct
        return res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (error) {

        console.log("Verify OTP Error:", error);

        return res.status(500).json({
            message: "Server error while verifying OTP"
        });

    }

});


// =====================================================
// RESET PASSWORD
// =====================================================

router.post("/reset-password", async (req, res) => {

    try {

        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {

            return res.status(400).json({
                message: "Email, OTP and new password are required"
            });

        }

        if (newPassword.length < 6) {

            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });

        }

        const cleanEmail = email.toLowerCase().trim();

        // Verify OTP again
        const resetData = await PasswordReset.findOne({
            email: cleanEmail,
            otp: otp.toString().trim()
        });

        if (!resetData) {

            return res.status(400).json({
                message: "Invalid or expired OTP"
            });

        }

        // Check expiry
        if (new Date() > resetData.expiresAt) {

            await PasswordReset.deleteOne({
                _id: resetData._id
            });

            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP."
            });

        }

        // Find user
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        // Update password
        user.password = hashedPassword;

        await user.save();

        // Delete used OTP
        await PasswordReset.deleteOne({
            _id: resetData._id
        });

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {

        console.log("Reset Password Error:", error);

        return res.status(500).json({
            message: "Server error while resetting password"
        });

    }

});

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/admin-login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                message: "Email and password are required"

            });

        }

        const cleanEmail = email.toLowerCase().trim();

        const admin = await User.findOne({

            email: cleanEmail

        });

        if (!admin) {

            return res.status(401).json({

                message: "Invalid admin email or password"

            });

        }


        // Admin + Super Admin allowed

        if (
            admin.role !== "admin" &&
            admin.role !== "superadmin"
        ) {

            return res.status(403).json({

                message:
                    "Access denied. Admin account required."

            });

        }


        const passwordMatch = await bcrypt.compare(

            password,

            admin.password

        );

        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid admin email or password"

            });

        }


       const token = jwt.sign(
    {
        id: admin._id.toString(),
        role: admin.role,
        departments: admin.departments || []
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "2h"
    }
);

        res.status(200).json({

            message: "Admin login successful",

            token: token,

            admin: {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    departments: admin.departments || []
}

        });

    } catch (error) {

        console.log("Admin Login Error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

});


// =====================================================
// SUPER ADMIN - GET ALL USERS
// =====================================================

router.get("/users", adminAuth, async (req, res) => {

    try {

        // Only Super Admin

        if (req.admin.role !== "superadmin") {

            return res.status(403).json({

                message:
                    "Only Super Admin can manage admins"

            });

        }

        const users = await User.find({})

            .select("-password")

            .sort({ name: 1 });


        res.status(200).json({

            users: users

        });

    } catch (error) {

        console.log("Get Users Error:", error);

        res.status(500).json({

            message: "Server error"

        });

    }

});


// =====================================================
// SUPER ADMIN - CHANGE USER ROLE + DEPARTMENTS
// =====================================================

router.put(
    "/change-role/:userId",
    adminAuth,
    async (req, res) => {

        try {

            // ==========================================
            // ONLY SUPER ADMIN
            // ==========================================

            if (req.admin.role !== "superadmin") {

                return res.status(403).json({
                    message:
                        "Only Super Admin can change user roles"
                });

            }


            // ==========================================
            // GET ROLE + DEPARTMENTS
            // ==========================================

            const {
                role,
                departments = []
            } = req.body;


            // ==========================================
            // VALID ROLES
            // ==========================================

            if (!["user", "admin"].includes(role)) {

                return res.status(400).json({
                    message: "Invalid role"
                });

            }


            // ==========================================
            // FIND USER
            // ==========================================

            const user =
                await User.findById(req.params.userId);


            if (!user) {

                return res.status(404).json({
                    message: "User not found"
                });

            }


            // ==========================================
            // SUPER ADMIN CANNOT BE CHANGED
            // ==========================================

            if (user.role === "superadmin") {

                return res.status(403).json({
                    message:
                        "Super Admin role cannot be changed"
                });

            }


            // ==========================================
            // IF MAKING ADMIN
            // ==========================================

            if (role === "admin") {

                if (
                    !Array.isArray(departments) ||
                    departments.length === 0
                ) {

                    return res.status(400).json({
                        message:
                            "Please select at least one department"
                    });

                }

                user.departments = departments;

            }


            // ==========================================
            // IF DEMOTING TO USER
            // ==========================================

            else {

                user.departments = [];

            }


            // ==========================================
            // UPDATE ROLE
            // ==========================================

            user.role = role;


            await user.save();


            // ==========================================
            // RESPONSE
            // ==========================================

            return res.status(200).json({

                message:
                    role === "admin"
                        ? "User is now an admin"
                        : "User changed to normal user",

                user: {

                    id: user._id,

                    name: user.name,

                    email: user.email,

                    role: user.role,

                    departments:
                        user.departments || []

                }

            });

        }

        catch (error) {

            console.log(
                "Change Role Error:",
                error
            );

            return res.status(500).json({
                message: "Server error"
            });

        }

    }
);


// =====================================================
// OLD MAKE ADMIN ROUTE
// =====================================================
// This is kept so old code does not break.

router.put(
    "/make-admin/:userId",
    adminAuth,
    async (req, res) => {

        try {

            if (req.admin.role !== "superadmin") {

                return res.status(403).json({

                    message:
                        "Only Super Admin can manage admins"

                });

            }


            const user = await User.findById(

                req.params.userId

            );


            if (!user) {

                return res.status(404).json({

                    message: "User not found"

                });

            }


            if (user.role === "superadmin") {

                return res.status(403).json({

                    message:
                        "Super Admin cannot be changed"

                });

            }


            user.role = "admin";

            await user.save();


            res.status(200).json({

                message: "User is now an admin",

                user: {

                    id: user._id,

                    name: user.name,

                    email: user.email,

                    role: user.role

                }

            });

        } catch (error) {

            console.log("Make Admin Error:", error);

            res.status(500).json({

                message: "Server error"

            });

        }

    }
);


module.exports = router;