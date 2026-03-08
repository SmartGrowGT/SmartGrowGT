'use strict';

import mongoose from "mongoose";

const alertLogSchema = new mongoose.Schema({

    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: [true, 'El deviceId es obligatorio']
    },

    fieldId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: [true, 'El fieldId es obligatorio']
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

}, {
    timestamps: true
})

alertLogSchema.index({ deviceId: 1 });
alertLogSchema.index({ fieldId: 1 });

export default mongoose.model('AlertLog', alertLogSchema);