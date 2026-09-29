const express = require("express");
const router = express.Router();

const AreaData = require("../models/AreaData");
const adminAuth = require("../middleware/authMiddleware");


// =====================================================
// GET ALL AREA DATA
// =====================================================

router.get("/all", adminAuth, async (req, res) => {

    try {

        const areas = await AreaData.find()
            .sort({ area: 1 });

        res.json({
            success: true,
            areas: areas
        });

    } catch (error) {

        console.error(
            "Get Area Data Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to load area data"
        });

    }

});


// =====================================================
// ADD AREA DATA
// =====================================================

router.post("/add", adminAuth, async (req, res) => {

    try {

        const {
            area,
            population,
            populationDensity,
            roadCondition,
            waterInfrastructure,
            drainageCondition,
            streetLighting,
            existingProjects,
            dataSource
        } = req.body;


        if (!area) {

            return res.status(400).json({
                success: false,
                message: "Area name is required"
            });

        }


        const existingArea =
            await AreaData.findOne({
                area: area.trim()
            });


        if (existingArea) {

            return res.status(400).json({
                success: false,
                message: "Area data already exists"
            });

        }


        const newArea =
            new AreaData({

                area: area.trim(),

                population:
                    Number(population) || 0,

                populationDensity:
                    populationDensity || "Medium",

                roadCondition:
                    roadCondition || "Unknown",

                waterInfrastructure:
                    waterInfrastructure || "Unknown",

                drainageCondition:
                    drainageCondition || "Unknown",

                streetLighting:
                    streetLighting || "Unknown",

                existingProjects:
                    Number(existingProjects) || 0,

                dataSource:
                    dataSource ||
                    "Admin Entered Data",

                lastUpdated:
                    new Date()

            });


        await newArea.save();


        res.status(201).json({

            success: true,

            message:
                "Area data added successfully",

            area: newArea

        });


    } catch (error) {

        console.error(
            "Add Area Data Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to add area data"

        });

    }

});


// =====================================================
// UPDATE AREA DATA
// =====================================================

router.put("/:id", adminAuth, async (req, res) => {

    try {

        const updatedArea =
            await AreaData.findByIdAndUpdate(

                req.params.id,

                {
                    ...req.body,
                    lastUpdated: new Date()
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedArea) {

            return res.status(404).json({

                success: false,

                message:
                    "Area data not found"

            });

        }


        res.json({

            success: true,

            message:
                "Area data updated successfully",

            area:
                updatedArea

        });


    } catch (error) {

        console.error(
            "Update Area Data Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to update area data"

        });

    }

});


// =====================================================
// DELETE AREA DATA
// =====================================================

router.delete("/:id", adminAuth, async (req, res) => {

    try {

        const deletedArea =
            await AreaData.findByIdAndDelete(
                req.params.id
            );


        if (!deletedArea) {

            return res.status(404).json({

                success: false,

                message:
                    "Area data not found"

            });

        }


        res.json({

            success: true,

            message:
                "Area data deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete Area Data Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to delete area data"

        });

    }

});


module.exports = router;