import { Router } from 'express';
import { getProducts, getProductById, getProductsByType } from './products.controller.js';

const router = Router();

// Listar todos los productos activos
router.get('/', getProducts);

// Obtener producto por ID
router.get('/:id', getProductById);

// Obtener productos por tipo (device / fertilizer)
router.get('/type/:productType', getProductsByType);

export default router;
