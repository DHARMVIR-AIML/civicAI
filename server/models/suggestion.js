const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema(
    {
        suggestionId: {
            type: String,
            unique: true,
            required: true
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
            default: "Submitted"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Suggestion", suggestionSchema);