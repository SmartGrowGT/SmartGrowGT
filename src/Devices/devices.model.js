'use strict';

import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['online', 'offline'],
        default: 'online'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model("Device", deviceSchema);