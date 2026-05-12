'use strict';

import { Schema, model } from 'mongoose';

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del producto es requerido'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'La descripción es requerida']
        },
        price: {
            type: Number,
            required: [true, 'El precio es requerido'],
            min: [0, 'El precio no puede ser negativo']
        },
        stock: {
            type: Number,
            required: [true, 'El stock es requerido'],
            min: [0, 'El stock no puede ser negativo'],
            default: 0
        },
        productType: {
            type: String,
            enum: ['device', 'fertilizer'],
            required: [true, 'El tipo de producto es requerido']
        },
        deviceRef: {
            type: Schema.Types.ObjectId,
            ref: 'Device',
            default: null
        },
        fertilizerRef: {
            type: Schema.Types.ObjectId,
            ref: 'Fertilizer',
            default: null
        },
        image: {
            type: String,
            default: null
        },
        imageId: {
            type: String,
            default: null
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default model('Product', ProductSchema);
