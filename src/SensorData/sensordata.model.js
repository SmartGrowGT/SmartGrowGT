'use strict';

import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: [true, 'El deviceId es obligatorio']
    },
    temperature: {
        type: Number,
        required: [true, 'La temperatura es obligatoria']
    },
    humidity: {
        type: Number,
        required: [true, 'La humedad es obligatoria']
    },
    unitTemp: {
        type: String,
        default: "C"
    },
    unitHum: {
        type: String,
        default: "%"
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

sensorDataSchema.index({ deviceId: 1 });
sensorDataSchema.index({ timestamp: -1 });

export default mongoose.model('SensorData', sensorDataSchema);
