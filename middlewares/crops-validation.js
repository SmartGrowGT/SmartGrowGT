import { param } from "express-validator";
import { checkValidators } from "./check-validators.js"; // tu función de middleware para errores

// Validación para obtener cultivos por nombre
export const validateGetCropByName = [
    param("nombreCultivo")
        .notEmpty()
        .withMessage("El nombre del cultivo es obligatorio")
        .isString()
        .withMessage("El nombre del cultivo debe ser una cadena de texto"),
    checkValidators, // middleware que maneja los errores de validación
];