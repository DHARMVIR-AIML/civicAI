const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const admin = await User.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({
                message: "Admin account not found"
            });
        }

        // Admin OR Super Admin can pass this middleware
        if (admin.role !== "admin" && admin.role !== "superadmin") {
            return res.status(403).json({
                message: "Admin access required"
            });
        }

        req.admin = admin;

        next();

    } catch (error) {

        console.log("Admin Auth Error:", error);

        return res.status(401).json({
            message: "Invalid or expired authentication token"
        });
    }
};

module.exports = adminAuth;