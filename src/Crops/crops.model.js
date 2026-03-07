"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CropSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        maximiumTemperature: {
            type: Number,
            required: true,
        },

        minimumTemperature: {
            type: Number,
            required: true,
        },

        maximumHumidity: {
            type: Number,
            required: true,
        },

        minimumHumidity: {
            type: Number,
            required: true,
        },

        maximumLight: {
            type: Number,
            required: true,
        },

        minimumLight: {
            type: Number,
            required: true,
        },

        irrigationPeriod: {
            type: Number,
            required: true,
        },

        growthDays: {
            type: Number,
            required: true,
        },

        sunlightRequirement: {
            type: String,
            enum: ["Bajo", "Medio", "Alto"],
            required: true,
        },

        image: {
            type: String,
            required: true
        },

        imageId: {
            type: String
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

// Crop
module.exports = mongoose.model("Crop", CropSchema);
