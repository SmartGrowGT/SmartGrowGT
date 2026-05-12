'use strict';

import Order from './orders.model.js';
import Cart from '../Cart/cart.model.js';
import Product from '../Products/products.model.js';

// CREAR PEDIDO DESDE EL CARRITO
export const createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress } = req.body;

        // Obtener carrito del usuario
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'El carrito está vacío'
            });
        }

        // Verificar stock de todos los productos
        for (const item of cart.items) {
            const product = await Product.findById(item.productId._id || item.productId);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para "${product?.name || 'producto'}". Disponible: ${product?.stock || 0}`
                });
            }
        }

        // Construir items del pedido
        const orderItems = cart.items.map(item => {
            const product = item.productId;
            return {
                productId: product._id || item.productId,
                productName: product.name || 'Producto',
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                subtotal: item.subtotal
            };
        });

        // Crear el pedido
        const order = await Order.create({
            userId,
            items: orderItems,
            totalAmount: cart.total,
            status: 'pendiente',
            shippingAddress
        });

        // Descontar stock de los productos
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.productId._id || item.productId,
                { $inc: { stock: -item.quantity } }
            );
        }

        // Vaciar carrito
        cart.items = [];
        cart.total = 0;
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el pedido',
            error: error.message
        });
    }
};

// OBTENER PEDIDOS DEL USUARIO
export const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId })
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los pedidos',
            error: error.message
        });
    }
};

// OBTENER PEDIDO POR ID
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('items.productId')
            .populate('userId');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el pedido',
            error: error.message
        });
    }
};

// CANCELAR PEDIDO (solo si está pendiente)
export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Pedido no encontrado'
            });
        }

        if (order.status !== 'pendiente') {
            return res.status(400).json({
                success: false,
                message: `No se puede cancelar un pedido con estado "${order.status}"`
            });
        }

        // Devolver stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: item.quantity } }
            );
        }

        order.status = 'cancelado';
        await order.save();

        res.status(200).json({
            success: true,
            message: 'Pedido cancelado exitosamente',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cancelar el pedido',
            error: error.message
        });
    }
};
