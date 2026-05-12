import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from './cart.controller.js';

const router = Router();

// Obtener carrito del usuario
router.get('/:userId', getCart);

// Agregar producto al carrito
router.post('/add', addToCart);

// Actualizar cantidad de un item
router.put('/update', updateCartItem);

// Eliminar item del carrito
router.delete('/remove/:userId/:productId', removeFromCart);

// Vaciar carrito
router.delete('/clear/:userId', clearCart);

export default router;
