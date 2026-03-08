'use strict';

import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema({
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
    alertType: {
        type: String,
        enum: ['bien', 'mal'],
        default: 'bien'
    }
}, {
    timestamps: true
})

reportsSchema.index({ deviceId: 1 });
reportsSchema.index({ fieldId: 1 });
reportsSchema.index({ alertType: 1 });

export default mongoose.model('Reports', reportsSchema);