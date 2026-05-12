'use strict';

import { Schema, model } from 'mongoose';

const CartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'La cantidad mínima es 1']
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const CartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true,
            unique: true
        },
        items: {
            type: [CartItemSchema],
            default: []
        },
        total: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    { timestamps: true }
);

export default model('Cart', CartSchema);
