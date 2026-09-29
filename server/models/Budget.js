const mongoose = require("mongoose");

const departmentAllocationSchema = new mongoose.Schema(
    {
        department: {
            type: String,
            required: true
        },

        allocatedBudget: {
            type: Number,
            required: true,
            min: 0
        },

        percentage: {
            type: Number,
            default: 0
        },

        complaints: {
            type: Number,
            default: 0
        },

        highPriority: {
            type: Number,
            default: 0
        },

        mediumPriority: {
            type: Number,
            default: 0
        },

        lowPriority: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
);

const budgetSchema = new mongoose.Schema(
    {
        totalBudget: {
            type: Number,
            required: true,
            min: 0
        },

        allocations: {
            type: [departmentAllocationSchema],
            default: []
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["Distributed", "Draft"],
            default: "Distributed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Budget", budgetSchema);