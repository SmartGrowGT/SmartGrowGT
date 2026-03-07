'use strict';

import mongoose from "mongoose";

const reportsSchema = new mongoose.Schema({
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
    alertType: {
        type: String,
        enum: ['bien', 'mal'],
        default: 'bien'
    }
},{
    timestamps:true
})

reportsSchema.index({ hardwareId: 1 });
reportsSchema.index({ fieldId: 1 });
reportsSchema.index({ alertType: 1 });

export default mongoose.model('Reports', reportsSchema);