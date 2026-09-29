const express = require("express");
const Budget = require("../models/Budget");
const adminAuth = require("../middleware/authMiddleware");

const router = express.Router();


// =====================================================
// 1. SAVE / DISTRIBUTE BUDGET
// ONLY SUPER ADMIN
// =====================================================

router.post("/distribute", adminAuth, async (req, res) => {
    try {

        // Only Super Admin
        if (req.admin.role !== "superadmin") {
            return res.status(403).json({
                success: false,
                message: "Only Super Admin can distribute budget"
            });
        }

        const {
            totalBudget,
            allocations
        } = req.body;


        // Validate total budget
        if (
            totalBudget === undefined ||
            totalBudget === null ||
            Number(totalBudget) <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid total budget is required"
            });
        }


        // Validate allocations
        if (
            !Array.isArray(allocations) ||
            allocations.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Department allocations are required"
            });
        }


        // Calculate allocation total
        const allocationTotal =
            allocations.reduce(
                (total, item) => {
                    return total +
                        Number(item.allocatedBudget || 0);
                },
                0
            );


        // Small rounding tolerance
        if (
            Math.abs(
                allocationTotal -
                Number(totalBudget)
            ) > 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Department allocation does not match total budget"
            });
        }


        // Create budget record
        const budget = new Budget({
            totalBudget: Number(totalBudget),

            allocations: allocations.map(item => ({
                department: item.department,
                allocatedBudget:
                    Number(item.allocatedBudget || 0),
                percentage:
                    Number(item.percentage || 0),
                complaints:
                    Number(item.complaints || 0),
                highPriority:
                    Number(item.highPriority || 0),
                mediumPriority:
                    Number(item.mediumPriority || 0),
                lowPriority:
                    Number(item.lowPriority || 0)
            })),

            createdBy: req.admin._id,

            status: "Distributed"
        });


        await budget.save();


        return res.status(201).json({
            success: true,
            message: "Budget distributed successfully",
            budget
        });

    } catch (error) {

        console.log(
            "Budget Distribution Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to distribute budget"
        });
    }
});


// =====================================================
// 2. GET LATEST BUDGET
// SUPER ADMIN → ALL DEPARTMENTS
// ADMIN → ASSIGNED DEPARTMENTS ONLY
// =====================================================

router.get("/latest", adminAuth, async (req, res) => {

    try {

        const budget =
            await Budget.findOne()
                .sort({ createdAt: -1 });


        if (!budget) {

            return res.status(404).json({
                success: false,
                message: "No budget has been distributed yet"
            });

        }


        // =============================================
        // SUPER ADMIN
        // =============================================

        if (req.admin.role === "superadmin") {

            return res.status(200).json({
                success: true,
                budget
            });

        }


        // =============================================
        // NORMAL ADMIN
        // =============================================

        if (req.admin.role === "admin") {

            const assignedDepartments =
                req.admin.departments || [];


            const filteredAllocations =
                budget.allocations.filter(
                    allocation =>
                        assignedDepartments.includes(
                            allocation.department
                        )
                );


            return res.status(200).json({

                success: true,

                budget: {

                    _id: budget._id,

                    totalBudget:
                        budget.totalBudget,

                    status:
                        budget.status,

                    createdAt:
                        budget.createdAt,

                    allocations:
                        filteredAllocations
                }

            });

        }


        // =============================================
        // OTHER USERS
        // =============================================

        return res.status(403).json({
            success: false,
            message: "Budget access denied"
        });


    } catch (error) {

        console.log(
            "Get Latest Budget Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch budget"
        });
    }

});


// =====================================================
// 3. GET ALL BUDGET HISTORY
// ONLY SUPER ADMIN
// =====================================================

router.get("/history", adminAuth, async (req, res) => {

    try {

        if (req.admin.role !== "superadmin") {

            return res.status(403).json({
                success: false,
                message:
                    "Only Super Admin can view budget history"
            });

        }


        const budgets =
            await Budget.find()
                .populate(
                    "createdBy",
                    "name email role"
                )
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({
            success: true,
            budgets
        });


    } catch (error) {

        console.log(
            "Budget History Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch budget history"
        });
    }

});


module.exports = router;