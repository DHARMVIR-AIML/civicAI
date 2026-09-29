const express = require("express");
const Suggestion = require("../models/Suggestion");
const User = require("../models/User");

const router = express.Router();


// ===============================
// SUBMIT DEVELOPMENT SUGGESTION
// ===============================

router.post("/submit", async (req, res) => {

    try {

        const {
            userId,
            title,
            category,
            description,
            location
        } = req.body;


        // Check user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // Validate fields
        if (!userId || !title || !category || !description || !location) {

            return res.status(400).json({
                message: "All suggestion fields are required"
            });

        }


        // Generate Suggestion ID
        const suggestionId = "SUG" + Date.now();


        // Create suggestion
        const suggestion = new Suggestion({

            suggestionId,
            userId,
            title,
            category,
            description,
            location

        });


        // Save to MongoDB
        await suggestion.save();


        // Response
        res.status(201).json({

            message: "Development suggestion submitted successfully",

            suggestionId: suggestion.suggestionId,

            suggestion: suggestion

        });


    } catch (error) {

        console.log("Suggestion Error:", error);

        res.status(500).json({

            message: "Failed to submit suggestion"

        });

    }

});


module.exports = router;