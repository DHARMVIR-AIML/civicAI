const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        complaintId: {
            type: String,
            unique: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        requestType: {
            type: String,
            required: true,
            enum: ["Complaint", "Development Need"]
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        location: {
            type: String,
            required: true
        },

        photo: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            default: "Pending"
        },


        // =============================================
        // AI ANALYSIS
        // =============================================

        aiCategory: {
            type: String,
            default: ""
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        department: {
            type: String,
            default: ""
        }

    },

    {
        timestamps: true
    }
);


module.exports =
    mongoose.model("Complaint", complaintSchema);