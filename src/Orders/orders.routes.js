import { Router } from 'express';
import { createOrder, getOrdersByUser, getOrderById, cancelOrder } from './orders.controller.js';

const router = Router();

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);
router.get('/:id', getOrderById);
router.put('/cancel/:id', cancelOrder);

export default router;
