import { Router } from 'express';
import { getFertilizers, getFertilizerById } from './fertilizers.controller.js';

const router = Router();

// Listar todos los fertilizantes activos
router.get('/', getFertilizers);

// Obtener fertilizante por ID
router.get('/:id', getFertilizerById);

export default router;
