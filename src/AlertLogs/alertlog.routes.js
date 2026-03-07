import { param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validación para obtener alerta por ID
export const validateGetAlertById = [
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];

// Validación para obtener alertas por hardware
export const validateGetAlertsByHardware = [
  param('hardwareId')
    .trim()
    .notEmpty()
    .withMessage('El hardwareId es requerido'),
  checkValidators,
];

// Validación para obtener alertas por campo
export const validateGetAlertsByField = [
  param('fieldId')
    .trim()
    .notEmpty()
    .withMessage('El fieldId es requerido'),
  checkValidators,
];