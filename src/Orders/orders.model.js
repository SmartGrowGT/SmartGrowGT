'use strict';

import { Schema, model } from 'mongoose';

const OrderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
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

const OrderSchema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        items: {
            type: [OrderItemSchema],
            required: true,
            validate: {
                validator: (v) => v.length > 0,
                message: 'El pedido debe tener al menos un producto'
            }
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'],
            default: 'pendiente'
        },
        shippingAddress: {
            type: String,
            required: [true, 'La dirección de envío es requerida']
        }
    },
    { timestamps: true }
);

export default model('Order', OrderSchema);
