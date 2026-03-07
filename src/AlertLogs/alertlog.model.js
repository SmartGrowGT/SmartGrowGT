'use strict';

import mongoose from "mongoose";

const alertLogSchema = new mongoose.Schema({

    hardwareId: {
        type: String,
        required: [true, 'El hardwareId es obligatorio'],
        trim: true
    },

    fieldId: {
        type: String,
        required: [true, 'El fieldId es obligatorio'],
        trim: true
    },

    humidity: {
        type: Number,
        required: [true, 'La humedad es obligatoria']
    },

    temperature: {
        type: Number,
        required: [true, 'La temperatura es obligatoria']
    },

    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },

    alertType: {
        type: String,
        enum: ['bad'],
        default: 'bad'
    }

},{
    timestamps:true
})

alertLogSchema.index({ hardwareId: 1 });
alertLogSchema.index({ fieldId: 1 });

export default mongoose.model('AlertLog', alertLogSchema);