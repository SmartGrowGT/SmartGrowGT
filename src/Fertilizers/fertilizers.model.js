'use strict';

import { Schema, model } from 'mongoose';

const FertilizerSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre del fertilizante es requerido'],
            trim: true
        },
        brand: {
            type: String,
            required: [true, 'La marca es requerida'],
            trim: true
        },
        grade: {
            type: String,
            required: [true, 'El grado es requerido (ej: 18-46-00)'],
            trim: true
        },
        nitrogenPercent: {
            type: Number,
            required: [true, 'El porcentaje de Nitrógeno (N) es requerido'],
            min: 0,
            max: 100
        },
        phosphorusPercent: {
            type: Number,
            required: [true, 'El porcentaje de Fósforo (P) es requerido'],
            min: 0,
            max: 100
        },
        potassiumPercent: {
            type: Number,
            required: [true, 'El porcentaje de Potasio (K) es requerido'],
            min: 0,
            max: 100
        },
        presentationWeight: {
            type: Number,
            required: [true, 'El peso por presentación es requerido (kg)'],
            min: 0,
            description: 'Peso en kilogramos por saco/presentación comercial'
        },
        description: {
            type: String,
            default: ''
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

export default model('Fertilizer', FertilizerSchema);
