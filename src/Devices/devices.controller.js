'use strict';

import Device from "./devices.model.js";
import crypto from 'node:crypto';

export const registerDevice = async (req, res) => {
    try {
        const { name, description, userId, deviceId } = req.body;

        // GENERACIÓN DEL ID POR DEFECTO O USO DEL HARDWARE ID
        // Utilizamos el deviceId proveído (por ejemplo, escaneado de la placa Raspberry Pi Pico W)
        // o generamos un ID corto y legible por defecto si no viene ninguno.
        const finalDeviceId = deviceId || `SG-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

        const newDevice = new Device({
            userId, // Se asigna el usuario dueño del dispositivo
            deviceId: finalDeviceId, // Asigna el ID real físico o el generado automáticamente
            name,
            description,
            status: 'online'
        });

        await newDevice.save();

        res.status(201).json({
            success: true,
            message: 'Dispositivo registrado con éxito',
            deviceId: finalDeviceId // Se lo devolvemos al usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar',
            error: error.message
        });
    }
};

export const getDeviceById = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const device = await Device.findOne({ deviceId });

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Dispositivo no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            device
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener el dispositivo",
            error: error.message
        });
    }
};

export const getDevicesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const devices = await Device.find({ userId });

        if (!devices) {
            return res.status(404).json({
                success: false,
                message: "Dispositivos no encontrados"
            });
        }

        return res.status(200).json({
            success: true,
            devices
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los dispositivos",
            error: error.message
        });
    }
};

export const updateDevice = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { name, description } = req.body;

        // Solo actualizamos los campos permitidos
        const device = await Device.findOneAndUpdate(
            { deviceId },
            { name, description, lastUpdate: Date.now() },
            { new: true, runValidators: true }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: "Dispositivo no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Dispositivo actualizado correctamente",
            device
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el dispositivo",
            error: error.message
        });
    }
};

export const changeDeviceStatus = async (req, res) => {
    try {
        const { deviceId } = req.params;

        const status = req.url.includes('/activate') ? 'online' : 'offline';

        const device = await Device.findOneAndUpdate(
            { deviceId },
            { status },
            { new: true }
        );

        if (!device) {
            return res.status(404).json({
                success: false,
                message: 'Dispositivo no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: `Dispositivo ${status === 'online' ? 'conectado' : 'desconectado'}`,
            data: device
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar estado',
            error: error.message
        });
    }
};