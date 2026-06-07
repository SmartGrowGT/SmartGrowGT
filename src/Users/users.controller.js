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
        const usuario = await Usuario.findById(id); // Busca por ID sin importar el estado

        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.status(200).json({ success: true, usuario });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error interno', error });
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

        // YA NO BORRAMOS isActive AQUÍ para permitir que el frontend lo cambie
        delete updates._id; 

        // Usamos findByIdAndUpdate que busca por ID sin importar el estado
        const user = await Usuario.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
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

        // Quitamos el filtro isActive: true
        const user = await Usuario.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

        res.status(200).json({ success: true, message: 'Usuario desactivado', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error', error });
    }
};

// NUEVA FUNCIÓN: Reactivar usuario
export const activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await Usuario.findByIdAndUpdate(
            id,
            { isActive: true },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

        res.status(200).json({ success: true, message: 'Usuario reactivado', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error', error });
    }
};