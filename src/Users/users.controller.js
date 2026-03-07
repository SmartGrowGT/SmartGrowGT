import Usuario from './users.model.js';

export const getUsers = async (req, res) => {
    try {
        const usuarios = await Usuario.find();

        if (usuarios.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron usuarios'
            });
        }

        res.status(200).json({
            success: true,
            total: usuarios.length,
            usuarios
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener usuarios',
            error
        });
    }
};


export const getUserById = async (req, res) => {
    try {

        const { id } = req.params;

        const usuario = await Usuario.findOne({
            _id: id,
            isActive: true
        });

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            usuario
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el usuario',
            error
        });
    }
};


export const createUser = async (req, res) => {
    try {

        const data = req.body;

        const usuario = new Usuario(data);

        await usuario.save();

        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            usuario
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error
        });
    }
};


// Editar perfil
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // No permitir cambiar _id ni isActive directamente
        delete updates._id;
        delete updates.isActive;

        const user = await Usuario.findOneAndUpdate(
            { _id: id, isActive: true },
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado o desactivado' });
        }

        res.status(200).json({ success: true, message: 'Usuario actualizado', user });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar usuario', error });
    }
};

// Desactivar usuario
export const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findOneAndUpdate(
            { _id: id, isActive: true },
            { isActive: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado o ya desactivado' });
        }

        res.status(200).json({ success: true, message: 'Usuario desactivado', user });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al desactivar usuario', error });
    }
};