import { Router } from 'express';
import { calculateRecommendation, calculateAIRecommendation } from './fertility.controller.js';

const router = Router();

// Calcular recomendación de fertilidad
router.post('/calculate', calculateRecommendation);

// Calcular recomendación de fertilidad basada en IA
router.post('/calculate-ai', calculateAIRecommendation);

export default router;
