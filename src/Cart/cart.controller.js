'use strict';

import Cart from './cart.model.js';
import Product from '../Products/products.model.js';

// OBTENER CARRITO DEL USUARIO
export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        let cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            cart = await Cart.create({ userId, items: [], total: 0 });
        }

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el carrito',
            error: error.message
        });
    }
};

// AGREGAR PRODUCTO AL CARRITO
export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Verificar que el producto existe y tiene stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        if (!product.isActive) {
            return res.status(400).json({
                success: false,
                message: 'El producto no está disponible'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Stock insuficiente. Disponible: ${product.stock}`
            });
        }

        // Obtener o crear carrito
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [], total: 0 });
        }

        // Verificar si el producto ya está en el carrito
        const existingItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (existingItemIndex > -1) {
            // Actualizar cantidad
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (product.stock < newQuantity) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente. Disponible: ${product.stock}`
                });
            }
            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].subtotal = newQuantity * product.price;
        } else {
            // Agregar nuevo item
            cart.items.push({
                productId,
                quantity,
                unitPrice: product.price,
                subtotal: quantity * product.price
            });
        }

        // Recalcular total
        cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.productId');

        res.status(200).json({
            success: true,
            message: 'Producto agregado al carrito',
            data: populatedCart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al agregar al carrito',
            error: error.message
        });
    }
};

// ACTUALIZAR CANTIDAD DE UN ITEM
export const updateCartItem = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad mínima es 1'
            });
        }

        const product = await Product.findById(productId);
        if (!product || product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Stock insuficiente. Disponible: ${product?.stock || 0}`
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Carrito no encontrado'
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado en el carrito'
            });
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = quantity * product.price;

        cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.productId');

        res.status(200).json({
            success: true,
            message: 'Carrito actualizado',
            data: populatedCart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el carrito',
            error: error.message
        });
    }
};

// ELIMINAR ITEM DEL CARRITO
export const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Carrito no encontrado'
            });
        }

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        cart.total = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

        await cart.save();

        const populatedCart = await Cart.findById(cart._id).populate('items.productId');

        res.status(200).json({
            success: true,
            message: 'Producto eliminado del carrito',
            data: populatedCart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar del carrito',
            error: error.message
        });
    }
};

// VACIAR CARRITO
export const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Carrito no encontrado'
            });
        }

        cart.items = [];
        cart.total = 0;

        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Carrito vaciado',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al vaciar el carrito',
            error: error.message
        });
    }
};
