const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const nodemailer = require("nodemailer");
const { analyzeComplaint } = require("../ai/complaintAI");
const adminAuth = require("../middleware/authMiddleware");
const userAuth = require("../middleware/userAuthMiddleware");

const router = express.Router();
// =====================================================
// ADMIN DEPARTMENT ACCESS CHECK
// =====================================================

function canAccessDepartment(admin, complaintDepartment) {

    // Superadmin can access everything
    if (admin.role === "superadmin") {
        return true;
    }

    // Normal admin must have assigned departments
    if (
        admin.role === "admin" &&
        Array.isArray(admin.departments) &&
        admin.departments.length > 0
    ) {
        return admin.departments.includes(complaintDepartment);
    }

    return false;
}


// =====================================================
// MULTER STORAGE
// =====================================================

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "server/uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }

});

const upload = multer({ storage: storage });


// =====================================================
// EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});

// =====================================================
// SUBMIT COMPLAINT
// =====================================================

router.post(
    "/submit",
    userAuth,
    upload.single("photo"),
    async (req, res) => {

    try {

        const {
    title,
    requestType,
    category,
    description,
    location
} = req.body;

const userId = req.user._id;


        const user = await User.findById(userId);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        if (
            !userId ||
            !title ||
            !requestType ||
            !category ||
            !description ||
            !location
        ) {

            return res.status(400).json({
                message: "All complaint fields are required"
            });

        }


        const complaintId = "CIV" + Date.now();


// =============================================
// AI COMPLAINT ANALYSIS
// =============================================

const aiAnalysis = analyzeComplaint({
    title,
    description,
    category
});


// =============================================
// CREATE COMPLAINT
// =============================================

const complaint = new Complaint({

    complaintId,

    userId,

    title,

    requestType,

    category,

    description,

    location,

    photo: req.file
        ? req.file.filename
        : "",

    aiCategory: aiAnalysis.category,

    priority: aiAnalysis.priority,

    department: aiAnalysis.department

});

        await complaint.save();


        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: user.email,

            subject: "CivicAI - Complaint Submitted Successfully",

            text: `
Hello ${user.name},

Your complaint has been submitted successfully.

Complaint ID: ${complaint.complaintId}
Category: ${category}
Status: Pending
Location: ${location}

Please keep this Complaint ID for tracking your complaint.

Thank you,
CivicAI Team
`

        });


        res.status(201).json({

            message: "Complaint submitted successfully",

            complaintId: complaint.complaintId,

            complaint: complaint

        });


    } catch (error) {

        console.log("Complaint Error:", error);

        res.status(500).json({

            message: "Failed to submit complaint"

        });

    }

});



// =====================================================
// USER - GET MY COMPLAINTS
// =====================================================

// =====================================================
// USER - GET MY COMPLAINTS
// =====================================================

router.get("/user/:userId", userAuth, async (req, res) => {

    try {

        // Always use the logged-in user's ID
        const userId = req.user._id;

        // User should see only their own complaints
        const complaints = await Complaint.find({
            userId: userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            complaints: complaints
        });

    } catch (error) {

        console.log("User Complaints Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user complaints"
        });

    }

});
// =====================================================
// ADMIN - USER COMPLAINT SUMMARY
// Shows how many complaints each user has submitted
// =====================================================

router.get("/admin/user-summary", adminAuth, async (req, res) => {

    try {

       const pipeline = [];

        if (req.admin.role === "admin") {

            const departments = req.admin.departments || [];

            pipeline.push({
                $match: {
                    department: {
                        $in: departments
                    }
                }
            });
        }

        const summary = await Complaint.aggregate([
            ...pipeline,

            {
                $group: {
                    _id: "$userId",
                    totalComplaints: {
                        $sum: 1
                    }
                }
            },

            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },

            {
                $unwind: "$user"
            },

            {
                $project: {
                    _id: 0,
                    userId: "$user._id",
                    name: "$user.name",
                    email: "$user.email",
                    totalComplaints: 1
                }
            },

            {
                $sort: {
                    totalComplaints: -1
                }
            }

        ]);


        res.status(200).json({
            success: true,
            users: summary
        });


    } catch (error) {

        console.log(
            "User Complaint Summary Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load user complaint summary"
        });

    }

});


// =====================================================
// ADMIN - GET COMPLAINTS OF A SPECIFIC USER
// =====================================================

router.get(
    "/admin/user/:userId",
    adminAuth,
    async (req, res) => {

        try {

            const { userId } = req.params;


            // Find user
            const user = await User.findById(userId)
                .select("-password");


            if (!user) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }


            // Find all complaints of this user
            const complaints = await Complaint.find({
                userId: userId
            })
            .sort({ createdAt: -1 });


            res.status(200).json({

                success: true,

                user: {

                    id: user._id,

                    name: user.name,

                    email: user.email

                },

                totalComplaints:
                    complaints.length,

                complaints:
                    complaints

            });


        } catch (error) {

            console.log(
                "Admin User Complaints Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Failed to fetch user complaints"

            });

        }

    }
);

// =====================================================
// ADMIN - GET COMPLAINTS
// Superadmin -> All complaints
// Admin -> Only assigned department complaints
// =====================================================

router.get("/admin/all", adminAuth, async (req, res) => {

    try {

        let complaints;

        // =============================================
        // SUPERADMIN -> ALL COMPLAINTS
        // =============================================

        if (req.admin.role === "superadmin") {

            complaints = await Complaint.find()
                .populate("userId", "name email")
                .sort({ _id: -1 });

        }

        // =============================================
        // ADMIN -> ASSIGNED DEPARTMENTS ONLY
        // =============================================

        else if (req.admin.role === "admin") {

            const departments = req.admin.departments || [];

            if (departments.length === 0) {

                return res.status(200).json({
                    success: true,
                    complaints: []
                });

            }

            complaints = await Complaint.find({
                department: {
                    $in: departments
                }
            })
                .populate("userId", "name email")
                .sort({ _id: -1 });

        }

        else {

            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });

        }

        res.status(200).json({
            success: true,
            complaints: complaints
        });

    } catch (error) {

        console.log("Admin Complaints Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch complaints"
        });

    }

});

// =====================================================
// ADMIN - UPDATE COMPLAINT STATUS
// =====================================================

router.put(
    "/admin/:complaintId/status",
    adminAuth,
    async (req, res) => {

    try {

        const { status } = req.body;


        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Resolved"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                message: "Invalid complaint status"

            });

        }


        const complaint = await Complaint.findOne({

            complaintId: req.params.complaintId

        });


        if (!complaint) {

            return res.status(404).json({

                message: "Complaint not found"

            });

        }
        // =============================================
// CHECK ADMIN DEPARTMENT ACCESS
// =============================================

if (!canAccessDepartment(
    req.admin,
    complaint.department
)) {

    return res.status(403).json({
        success: false,
        message: "You are not authorized to manage this department complaint"
    });

}


        complaint.status = status;

        await complaint.save();


        res.status(200).json({

            success: true,

            message: "Complaint status updated successfully",

            complaint: complaint

        });


    } catch (error) {

        console.log("Status Update Error:", error);

        res.status(500).json({

            success: false,

            message: "Failed to update complaint status"

        });

    }

});


// =====================================================
// TRACK COMPLAINT BY COMPLAINT ID
// =====================================================

router.get("/:complaintId", async (req, res) => {

    try {

        const complaint = await Complaint.findOne({

            complaintId: req.params.complaintId

        });


        if (!complaint) {

            return res.status(404).json({

                message: "Complaint not found"

            });

        }


        res.status(200).json(complaint);


    } catch (error) {

        console.log("Tracking Error:", error);

        res.status(500).json({

            message: "Failed to fetch complaint"

        });

    }

});


module.exports = router;