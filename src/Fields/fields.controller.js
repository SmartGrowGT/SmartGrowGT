import Field from './fields.model.js';

export const createField = async (req, res) => {
    try {
        const data = req.body;
        const field = new Field(data);
        
        await field.save();
        return res.status(201).send({
            success: true,
            message: 'Parcela creada exitosamente',
            field
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            success: false,
            message: 'Error al crear la parcela',
            err
        });
    }
};

export const getFields = async (req, res) => {
    try {
        const fields = await Field.find()
            .populate('user', 'name email') 
            .populate('crop', 'nombreCultivo');

        return res.send({
            success: true,
            total: fields.length,
            fields
        });
    } catch (err) {
        return res.status(500).send({
            success: false,
            message: 'Error al obtener las parcelas'
        });
    }
};

export const getFieldById = async (req, res) => {
    try {
        const { id } = req.params;
        const field = await Field.findById(id).populate('crop user');

        if (!field) return res.status(404).send({ message: 'Parcela no encontrada' });

        return res.send({ success: true, field });
    } catch (err) {
        return res.status(500).send({ message: 'Error al buscar la parcela' });
    }
};

export const updateField = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedField = await Field.findByIdAndUpdate(id, data, { new: true });

        if (!updatedField) return res.status(404).send({ message: 'No se encontró la parcela' });

        return res.send({
            success: true,
            message: 'Parcela actualizada',
            updatedField
        });
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar' });
    }
};

export const deleteField = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedField = await Field.findByIdAndDelete(id);

        if (!deletedField) return res.status(404).send({ message: 'Parcela no encontrada' });

        return res.send({ message: 'Parcela eliminada correctamente' });
    } catch (err) {
        return res.status(500).send({ message: 'Error al eliminar' });
    }
};