import Crop from "./crops.model.js";

// OBTENER TODOS LOS CULTIVOS ACTIVOS
export const getCrops = async (req, res) => {
    try {
        const crops = await Crop.find({ isActive: true }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: crops,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los cultivos",
            error: error.message,
        });
    }
};

// BUSCAR CULTIVOS POR NOMBRE (relacionado)
export const getCropByName = async (req, res) => {
    try {
        const { nombreCultivo } = req.params;

        const crops = await Crop.find({
            name: { $regex: nombreCultivo, $options: "i" },
            isActive: true,
        }).sort({ name: 1 });

        res.status(200).json({
            success: true,
            data: crops,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar el cultivo",
            error: error.message,
        });
    }
};