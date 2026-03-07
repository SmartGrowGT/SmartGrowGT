import { body } from 'express-validator';
import { checkValidators } from './check-validators.js'; // Tu middleware actual

export const fieldValidator = [
    body('name', 'El nombre de la parcela es obligatorio')
    .notEmpty(),
    body('location', 'La ubicación es obligatoria')
    .notEmpty(),
    body('area', 'El área debe ser un número positivo')
    .isNumeric()
    .isFloat({ min: 0 }),
    body('user', 'ID de usuario no válido')
    .isMongoId(),
    body('crop', 'ID de cultivo no válido')
    .isMongoId(),
    
    // Validaciones para los parametros tecnicos de suelo (opcionales al crear, pero deben ser numeros)
    body('soilData.cc', 'La Capacidad de Campo (CC) debe ser un número')
    .optional()
    .isNumeric(),
    body('soilData.pmp', 'El Punto de Marchitez (PMP) debe ser un número')
    .optional()
    .isNumeric(),
    body('soilData.zr', 'La Zona Radicular (Zr) debe ser un número')
    .optional()
    .isNumeric(),
    body('soilData.ur', 'El Umbral de Riego (Ur) debe ser un número')
    .optional()
    .isNumeric(),
    body('soilData.dap', 'La Densidad Aparente (Dap) debe ser un número')
    .optional()
    .isNumeric(),
    body('soilData.ib', 'La Infiltración Básica (Ib) debe ser un número')
    .optional()
    .isNumeric(),
    body('soilData.qest', 'El Caudal Estable (Qest) debe ser un número')
    .optional()
    .isNumeric(),
    
    checkValidators 
];