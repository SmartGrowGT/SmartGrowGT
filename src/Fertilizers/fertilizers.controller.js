'use strict';

import Fertilizer from './fertilizers.model.js';

// OBTENER TODOS LOS FERTILIZANTES ACTIVOS
export const getFertilizers = async (req, res) => {
    try {
        const fertilizers = await Fertilizer.find({ isActive: true }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: fertilizers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los fertilizantes',
            error: error.message
        });
    }
};

// OBTENER FERTILIZANTE POR ID
export const getFertilizerById = async (req, res) => {
    try {
        const { id } = req.params;
        const fertilizer = await Fertilizer.findById(id);

        if (!fertilizer) {
            return res.status(404).json({
                success: false,
                message: 'Fertilizante no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: fertilizer
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el fertilizante',
            error: error.message
        });
    }
};
