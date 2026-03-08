import { param } from 'express-validator';
import { checkValidators } from './check-validators.js';

// Validación para obtener reporte por ID
export const validateGetReportById = [
  param('id')
    .isMongoId()
    .withMessage('ID debe ser un ObjectId válido de MongoDB'),
  checkValidators,
];

// Validación para obtener reportes por campo
export const validateGetReportsByField = [
  param('fieldId')
    .trim()
    .notEmpty()
    .withMessage('El fieldId es requerido'),
  checkValidators,
];

// Validación para obtener reportes por hardware
export const validateGetReportsByHardware = [
  param('deviceId')
    .trim()
    .notEmpty()
    .withMessage('El hardwareId es requerido'),
  checkValidators,
];