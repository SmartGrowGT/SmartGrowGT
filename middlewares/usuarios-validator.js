'use strict'

export const validateUser = (req, res, next) => {
    try {

        const {
            name,
            surname,
            email,
            password,
            phone,
            address,
            department,
            municipality,
            farmerType,
            mainCrop
        } = req.body

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es requerido'
            })
        }

        if (!surname) {
            return res.status(400).json({
                success: false,
                message: 'El apellido es requerido'
            })
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'El correo es requerido'
            })
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña es requerida'
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener mínimo 6 caracteres'
            })
        }

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: 'El teléfono es requerido'
            })
        }

        if (phone.length !== 8) {
            return res.status(400).json({
                success: false,
                message: 'El teléfono debe tener 8 dígitos'
            })
        }

        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'La dirección es requerida'
            })
        }

        if (!department) {
            return res.status(400).json({
                success: false,
                message: 'El departamento es requerido'
            })
        }

        if (!municipality) {
            return res.status(400).json({
                success: false,
                message: 'El municipio es requerido'
            })
        }

        if (!farmerType) {
            return res.status(400).json({
                success: false,
                message: 'El tipo de agricultor es requerido'
            })
        }

        if (!mainCrop) {
            return res.status(400).json({
                success: false,
                message: 'El cultivo principal es requerido'
            })
        }

        next()

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en la validación de usuario',
            error
        })
    }
}