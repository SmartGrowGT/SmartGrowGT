import { body, param } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateCreateCrop = [
    body("userId")
        .notEmpty()
        .withMessage("El userId es obligatorio")
        .isMongoId()
        .withMessage("El userId debe ser un ObjectId válido"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre del cultivo es obligatorio")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage("El nombre solo puede contener letras"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("La descripción es obligatoria")
        .isLength({ min: 10, max: 500 })
        .withMessage("La descripción debe tener entre 10 y 500 caracteres"),

    body("minimumTemperature")
        .notEmpty()
        .withMessage("La temperatura mínima es obligatoria")
        .isFloat({ min: -50, max: 100 })
        .withMessage("La temperatura mínima debe estar entre -50 y 100"),

    body("maximiumTemperature")
        .notEmpty()
        .withMessage("La temperatura máxima es obligatoria")
        .isFloat({ min: -50, max: 100 })
        .withMessage("La temperatura máxima debe estar entre -50 y 100")
        .custom((value, { req }) => {
            if (parseFloat(value) <= parseFloat(req.body.minimumTemperature)) {
                throw new Error("La temperatura máxima debe ser mayor que la mínima");
            }

            return true;
        }),

    body("minimumHumidity")
        .notEmpty()
        .withMessage("La humedad mínima es obligatoria")
        .isFloat({ min: 0, max: 100 })
        .withMessage("La humedad mínima debe estar entre 0 y 100"),

    body("maximumHumidity")
        .notEmpty()
        .withMessage("La humedad máxima es obligatoria")
        .isFloat({ min: 0, max: 100 })
        .withMessage("La humedad máxima debe estar entre 0 y 100")
        .custom((value, { req }) => {
            if (parseFloat(value) <= parseFloat(req.body.minimumHumidity)) {
                throw new Error("La humedad máxima debe ser mayor que la mínima");
            }

            return true;
        }),

    body("minimumLight")
        .notEmpty()
        .withMessage("La luz mínima es obligatoria")
        .isFloat({ min: 0 })
        .withMessage("La luz mínima debe ser mayor o igual a 0"),

    body("maximumLight")
        .notEmpty()
        .withMessage("La luz máxima es obligatoria")
        .isFloat({ min: 0 })
        .withMessage("La luz máxima debe ser mayor o igual a 0")
        .custom((value, { req }) => {
            if (parseFloat(value) <= parseFloat(req.body.minimumLight)) {
                throw new Error("La luz máxima debe ser mayor que la mínima");
            }

            return true;
        }),

    body("irrigationPeriod")
        .notEmpty()
        .withMessage("El periodo de riego es obligatorio")
        .isInt({ min: 1, max: 365 })
        .withMessage("El periodo de riego debe estar entre 1 y 365 días"),

    body("growthDays")
        .notEmpty()
        .withMessage("Los días de crecimiento son obligatorios")
        .isInt({ min: 1, max: 1000 })
        .withMessage("Los días de crecimiento deben estar entre 1 y 1000"),

    body("sunlightRequirement")
        .notEmpty()
        .withMessage("El requerimiento de luz solar es obligatorio")
        .isIn(["Bajo", "Medio", "Alto"])
        .withMessage("El requerimiento de luz solar no es válido"),

    checkValidators,
];

export const validateUpdateCrop = [
    param("id").isMongoId().withMessage("El ID debe ser un ObjectId válido"),

    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("La descripción no puede exceder 500 caracteres"),

    body("minimumTemperature").optional().isFloat(),

    body("maximiumTemperature").optional().isFloat(),

    body("minimumHumidity").optional().isFloat({ min: 0, max: 100 }),

    body("maximumHumidity").optional().isFloat({ min: 0, max: 100 }),

    body("minimumLight").optional().isFloat({ min: 0 }),

    body("maximumLight").optional().isFloat({ min: 0 }),

    body("irrigationPeriod").optional().isInt({ min: 1 }),

    body("growthDays").optional().isInt({ min: 1 }),

    body("sunlightRequirement").optional().isIn(["Bajo", "Medio", "Alto"]),

    checkValidators,
];

export const validateGetCropById = [
    param("id").isMongoId().withMessage("El ID debe ser un ObjectId válido"),

    checkValidators,
];

export const validateCropStatusChange = [
    param("id").isMongoId().withMessage("El ID debe ser un ObjectId válido"),

    checkValidators,
];

export const validateGetCropsByUser = [
    param("userId")
        .isMongoId()
        .withMessage("El userId debe ser un ObjectId válido"),

    checkValidators,
];


