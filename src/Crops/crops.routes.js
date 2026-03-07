import { Router } from "express";
import {
    getCrops,
    getCropsByUser,
    searchCrops,
    getCropById,
    createCrop,
    updateCrop,
    changeCropStatus
} from "./crops.controller.js";

import {
    validateCreateCrop,
    validateUpdateCrop,
    validateGetCropById,
    validateCropStatusChange,
    validateGetCropsByUser
} from "../../middlewares/crops-validation.js";

import { uploadCropImage } from "../../middlewares/file-uploader.js";

const router = Router();

router.get("/", getCrops);

router.get("/search", searchCrops);

router.get("/user/:userId", validateGetCropsByUser, getCropsByUser);

router.get("/:id", validateGetCropById, getCropById);

router.post(
    "/",
    uploadCropImage.single("image"),
    validateCreateCrop,
    createCrop
);

router.put(
    "/:id",
    uploadCropImage.single("image"),
    validateUpdateCrop,
    updateCrop
);

router.put("/:id/activate", validateCropStatusChange, changeCropStatus);

router.put("/:id/deactivate", validateCropStatusChange, changeCropStatus);

export default router;