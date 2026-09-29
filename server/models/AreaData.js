const mongoose = require("mongoose");

const areaDataSchema = new mongoose.Schema(
    {
        // =============================================
        // AREA INFORMATION
        // =============================================

        area: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        // =============================================
        // DEMOGRAPHIC DATA
        // =============================================

        population: {
            type: Number,
            default: 0
        },

        populationDensity: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },

        // =============================================
        // INFRASTRUCTURE DATA
        // =============================================

        roadCondition: {
            type: String,
            enum: ["Good", "Average", "Poor", "Unknown"],
            default: "Unknown"
        },

        waterInfrastructure: {
            type: String,
            enum: ["Good", "Average", "Poor", "Unknown"],
            default: "Unknown"
        },

        drainageCondition: {
            type: String,
            enum: ["Good", "Average", "Poor", "Unknown"],
            default: "Unknown"
        },

        streetLighting: {
            type: String,
            enum: ["Good", "Average", "Poor", "Unknown"],
            default: "Unknown"
        },

        // =============================================
        // EXISTING DEVELOPMENT
        // =============================================

        existingProjects: {
            type: Number,
            default: 0
        },

        // =============================================
        // DATA SOURCE
        // =============================================

        dataSource: {
            type: String,
            default: "Admin Entered Data"
        },

        // =============================================
        // LAST DATA UPDATE
        // =============================================

        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("AreaData", areaDataSchema);