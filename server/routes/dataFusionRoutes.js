const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaint");
const AreaData = require("../models/AreaData");
const adminAuth = require("../middleware/authMiddleware");


// ======================================================
// CONTEXTUAL DATA FUSION + RESOURCE PRIORITY ANALYSIS
// ======================================================

router.get("/analysis", adminAuth, async (req, res) => {

    try {

        const complaints = await Complaint.find().sort({ createdAt: -1 });
        const areas = await AreaData.find();

        const analysis = [];


        for (const area of areas) {

            // ==================================================
            // 1. MATCH COMPLAINTS WITH AREA
            // ==================================================

            const areaComplaints = complaints.filter((complaint) => {

                const complaintLocation =
                    String(complaint.location || "")
                        .trim()
                        .toLowerCase();

                const areaName =
                    String(area.area || "")
                        .trim()
                        .toLowerCase();

                if (!complaintLocation || !areaName) {
                    return false;
                }

                return (
                    complaintLocation.includes(areaName) ||
                    areaName.includes(complaintLocation)
                );

            });


            // ==================================================
            // 2. COMPLAINT DEMAND
            // ==================================================

            const totalComplaints = areaComplaints.length;

            const highPriority =
                areaComplaints.filter(
                    c =>
                        String(c.priority || "").toLowerCase() === "high"
                ).length;

            const mediumPriority =
                areaComplaints.filter(
                    c =>
                        String(c.priority || "").toLowerCase() === "medium"
                ).length;

            const lowPriority =
                areaComplaints.filter(
                    c =>
                        String(c.priority || "").toLowerCase() === "low"
                ).length;


            // ==================================================
            // 3. INFRASTRUCTURE ISSUES
            // ==================================================

            let infrastructureIssues = 0;

            if (area.roadCondition === "Poor") {
                infrastructureIssues++;
            }

            if (area.waterInfrastructure === "Poor") {
                infrastructureIssues++;
            }

            if (area.drainageCondition === "Poor") {
                infrastructureIssues++;
            }

            if (area.streetLighting === "Poor") {
                infrastructureIssues++;
            }


            // ==================================================
            // 4. DEMAND LEVEL
            // ==================================================

            let demandLevel = "Low";

            if (totalComplaints >= 10) {
                demandLevel = "High";
            }
            else if (totalComplaints >= 5) {
                demandLevel = "Medium";
            }


            // ==================================================
            // 5. CONTEXT SCORE
            // ==================================================

            // Complaint Demand Score = 40
            const complaintScore =
                Math.min(totalComplaints / 10, 1) * 40;


            // Infrastructure Score = 30
            const infrastructureScore =
                (infrastructureIssues / 4) * 30;


            // Population Context Score = 20
            let populationScore = 0;

            const population = Number(area.population) || 0;

            if (population >= 20000) {
                populationScore = 20;
            }
            else if (population >= 10000) {
                populationScore = 15;
            }
            else if (population >= 5000) {
                populationScore = 10;
            }
            else if (population > 0) {
                populationScore = 5;
            }


            // Existing Projects Score = 10
            let projectScore = 10;

            const existingProjects =
                Number(area.existingProjects) || 0;

            if (existingProjects >= 5) {
                projectScore = 0;
            }
            else if (existingProjects >= 3) {
                projectScore = 3;
            }
            else if (existingProjects >= 1) {
                projectScore = 7;
            }


            // Final Context Score
            let contextScore =
                complaintScore +
                infrastructureScore +
                populationScore +
                projectScore;

            contextScore = Math.round(
                Math.max(0, Math.min(contextScore, 100))
            );


            // ==================================================
            // 6. CONTEXT LEVEL
            // ==================================================

            let contextLevel = "Low";

            if (contextScore >= 70) {
                contextLevel = "High";
            }
            else if (contextScore >= 40) {
                contextLevel = "Medium";
            }


            // ==================================================
            // 7. RESOURCE PRIORITY RECOMMENDATION
            // ==================================================

            let recommendedAction = "Routine Monitoring";

            if (contextScore >= 70) {
                recommendedAction = "Immediate Attention";
            }
            else if (contextScore >= 40) {
                recommendedAction = "Planned Attention";
            }


            // ==================================================
            // 8. FINAL ANALYSIS OBJECT
            // ==================================================

            analysis.push({

                area: area.area,

                population: population,

                populationDensity:
                    area.populationDensity,

                // Complaint information
                totalComplaints,
                highPriority,
                mediumPriority,
                lowPriority,

                // Infrastructure information
                infrastructureIssues,

                roadCondition:
                    area.roadCondition,

                waterInfrastructure:
                    area.waterInfrastructure,

                drainageCondition:
                    area.drainageCondition,

                streetLighting:
                    area.streetLighting,

                // Analysis
                demandLevel,

                contextScore,

                contextLevel,

                // Recommendation
                recommendedAction,

                // Other contextual information
                existingProjects,

                dataSource:
                    area.dataSource || "Admin Input"

            });

        }


        // ==================================================
        // RESPONSE
        // ==================================================

        res.json({
            success: true,
            analysis
        });


    }
    catch (error) {

        console.error(
            "Data Fusion Analysis Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to generate contextual analysis"
        });

    }

});


module.exports = router;