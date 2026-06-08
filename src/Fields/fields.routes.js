import { Router } from 'express';
import { createField, getFields, getFieldById, getFieldsByUser, updateField, deactivateField, activateField } from './fields.controller.js';
import { fieldValidator, validateUpdateField } from '../../middlewares/fields-validators.js';

const routes = Router();


// Listar todas las parcelas
routes.get('/', getFields);

// Buscar parcela por ID
routes.get('/:id', getFieldById);

// Listar parcelas por usuario
routes.get('/user/:userId', getFieldsByUser);

// Crear parcela (con validaciones)
routes.post('/', createField);

// Actualizar parcela
routes.put('/:id', [validateUpdateField], updateField);

// Eliminar parcela
routes.put('/deactivate/:id', deactivateField);

// Activar parcela (en caso de eliminacion)
routes.put('/activate/:id', activateField);

export default routes;