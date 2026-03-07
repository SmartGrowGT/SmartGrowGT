import Crop from "./crops.model.js";
import { cloudinary } from "../../middlewares/file-uploader.js";

// OBTENER TODOS LOS CULTIVOS
export const getCrops = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;

        const filter = { isActive };

        const crops = await Crop.find(filter)
            .limit(parseInt(limit))
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const total = await Crop.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: crops,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones",
            error: error.message,
        });
    }
};

// OBTENER CULTIVOS POR USUARIO
export const getCropsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const crops = await Crop.find({ userId });

        res.status(200).json({
            success: true,
            data: crops,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener las publicaciones del usuario",
            error: error.message,
        });
    }
};

// BUSCAR CULTIVOS POR NOMBRE O ID
export const searchCrops = async (req, res) => {
    try {
        const { search } = req.query;

        const crops = await Crop.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { _id: search },
            ],
        });

        res.status(200).json({
            success: true,
            data: crops,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error en la búsqueda",
            error: error.message,
        });
    }
};

// OBTENER CULTIVO POR ID
export const getCropById = async (req, res) => {
    try {
        const { id } = req.params;
        const crop = await Crop.findById(id);

        if (!crop)
            return res.status(404).json({ success: false, message: "Publicación no encontrada" });

        res.status(200).json({ success: true, data: crop });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la publicación",
            error: error.message,
        });
    }
};

// CREAR CULTIVO
export const createCrop = async (req, res) => {
    try {
        const cropData = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "La imagen es obligatoria" });
        }

        cropData.image = req.file.path;
        cropData.imageId = req.file.filename;

        const crop = new Crop(cropData);
        await crop.save();

        res.status(201).json({
            success: true,
            message: "Publicación creada exitosamente",
            data: crop,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear la publicación",
            error: error.message,
        });
    }
};

// ACTUALIZAR CULTIVO
export const updateCrop = async (req, res) => {
    try {
        const { id } = req.params;
        const crop = await Crop.findById(id);

        if (!crop) return res.status(404).json({ success: false, message: "Publicación no encontrada" });

        const updateData = { ...req.body };

        // Si envían nueva imagen
        if (req.file) {
            // borrar imagen anterior
            if (crop.imageId) {
                await cloudinary.uploader.destroy(crop.imageId);
            }

            // guardar nueva
            updateData.image = req.file.path;
            updateData.imageId = req.file.filename;
        }

        const updatedCrop = await Crop.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: "Publicación actualizada exitosamente",
            data: updatedCrop,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la publicación",
            error: error.message,
        });
    }
};

// ACTIVAR / DESACTIVAR CULTIVO
export const changeCropStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const isActive = req.url.includes("/activate");

        const crop = await Crop.findByIdAndUpdate(id, { isActive }, { new: true });

        if (!crop) return res.status(404).json({ success: false, message: "Publicación no encontrada" });

        res.status(200).json({
            success: true,
            message: `Publicación ${isActive ? "activada" : "desactivada"} exitosamente`,
            data: crop,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al cambiar el estado de la publicación",
            error: error.message,
        });
    }
};

// ELIMINAR CULTIVO
export const deleteCrop = async (req, res) => {
    try {
        const { id } = req.params;
        const crop = await Crop.findById(id);

        if (!crop) return res.status(404).json({ success: false, message: "Publicación no encontrada" });

        // borrar imagen de Cloudinary
        if (crop.imageId) {
            await cloudinary.uploader.destroy(crop.imageId);
        }

        await Crop.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Publicación eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la publicación",
            error: error.message,
        });
    }
};