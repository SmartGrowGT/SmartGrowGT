import { Router } from "express";
import { getCrops, getCropByName } from "./crops.controller.js";
import { validateGetCropByName } from "../../middlewares/crops-validation.js";

const router = Router();

// GET /cultivos/ → lista todos los cultivos
router.get("/", getCrops);

// GET /cultivos/:nombreCultivo → busca cultivos por nombre relacionado
router.get("/:nombreCultivo", validateGetCropByName, getCropByName);

export default router;