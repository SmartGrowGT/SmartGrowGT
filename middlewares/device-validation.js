import { body, param } from "express-validator";

export const validateDeviceId = [
    param('deviceId')
        .notEmpty().withMessage('El ID del dispositivo es requerido')
        .isString().withMessage('El ID del dispositivo debe ser una cadena de texto')
        .isLength({ min: 6 }).withMessage('El ID del dispositivo debe tener al menos 6 caracteres')
];

export const validateDeviceUpdate = [
    param('deviceId')
        .notEmpty().withMessage('El ID del dispositivo es requerido')
        .isString().withMessage('El ID del dispositivo debe ser una cadena de texto')
        .isLength({ min: 6 }).withMessage('El ID del dispositivo debe tener al menos 6 caracteres'),
    body('name')
        .notEmpty().withMessage('El nombre del dispositivo es requerido')
        .isString().withMessage('El nombre del dispositivo debe ser una cadena de texto')
        .isLength({ min: 3 }).withMessage('El nombre del dispositivo debe tener al menos 3 caracteres'),
    body('description')
        .notEmpty().withMessage('La descripción del dispositivo es requerida')
        .isString().withMessage('La descripción del dispositivo debe ser una cadena de texto')
        .isLength({ min: 10 }).withMessage('La descripción del dispositivo debe tener al menos 10 caracteres')
];

export const validateUserId = [
    param('userId')
        .notEmpty().withMessage('El ID del usuario es requerido')
        .isString().withMessage('El ID del usuario debe ser una cadena de texto')
        .isLength({ min: 24 }).withMessage('El ID del usuario debe tener al menos 24 caracteres')
];

