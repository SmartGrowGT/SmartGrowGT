'use strict';

import Product from './products.model.js';

// OBTENER TODOS LOS PRODUCTOS ACTIVOS
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .populate('deviceRef')
            .populate('fertilizerRef')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos',
            error: error.message
        });
    }
};

// OBTENER PRODUCTO POR ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
            .populate('deviceRef')
            .populate('fertilizerRef');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto',
            error: error.message
        });
    }
};

// OBTENER PRODUCTOS POR TIPO (device / fertilizer)
export const getProductsByType = async (req, res) => {
    try {
        const { productType } = req.params;

        const products = await Product.find({ productType, isActive: true })
            .populate('deviceRef')
            .populate('fertilizerRef')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos por tipo',
            error: error.message
        });
    }
};
