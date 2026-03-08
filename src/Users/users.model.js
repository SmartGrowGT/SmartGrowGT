'use strict';

import { Schema, model } from 'mongoose';

const usuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    surname: {
        type: String,
        required: [true, 'El apellido es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minLength: [6, 'La contraseña debe tener mínimo 6 caracteres']
    },
    phone: {
        type: String,
        required: [true, 'El teléfono es requerido'],
        minLength: 8,
        maxLength: 8
    },
    address: {
        type: String,
        required: [true, 'La dirección es requerida']
    },
    department: {
        type: String,
        required: [true, 'El departamento es requerido']
    },
    municipality: {
        type: String,
        required: [true, 'El municipio es requerido']
    },
    farmerType: {
        type: String,
        enum: ['Pequeño productor', 'Mediano productor', 'Cooperativa', 'Empresa agrícola'],
        required: [true, 'El tipo de agricultor es requerido']
    },
    mainCrop: {
        type: String,
        required: [true, 'El cultivo principal es requerido']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model('Usuario', usuarioSchema);