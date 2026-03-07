import { Router } from 'express';
import {createField, getFields, getFieldById, updateField, deleteField } from './fields.controller.js';
import { fieldValidator } from '../../middlewares/field.validators.js';

const api = Router();


// Listar todas las parcelas
api.get('/', getFields);

// Buscar parcela por ID
api.get('/:id', getFieldById);

// Crear parcela (con validaciones)
api.post('/', [fieldValidator], createField);

// Actualizar parcela
api.put('/:id', [fieldValidator], updateField);

// Eliminar parcela
api.delete('/:id', deleteField);

export default api;