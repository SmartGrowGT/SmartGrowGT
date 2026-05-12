import { Router } from 'express';
import { calculateRecommendation } from './fertility.controller.js';

const router = Router();

// Calcular recomendación de fertilidad
router.post('/calculate', calculateRecommendation);

export default router;
