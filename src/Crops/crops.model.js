"use strict";

import { Schema, model } from 'mongoose';

const CropSchema = new Schema(
    {
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

        // --- Perfil de Fertilidad Ideal (kg/Ha) ---
        idealNitrogen: {
            min: { type: Number, default: null },
            max: { type: Number, default: null }
        },
        idealPhosphorus: {
            min: { type: Number, default: null },
            max: { type: Number, default: null }
        },
        idealPotassium: {
            min: { type: Number, default: null },
            max: { type: Number, default: null }
        },
        idealPH: {
            min: { type: Number, default: null },
            max: { type: Number, default: null }
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

// Crop
export default model("Crop", CropSchema);
