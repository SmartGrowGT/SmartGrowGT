import { Router } from "express";
import { registerDevice, updateDevice, getDeviceById, changeDeviceStatus, getDevicesByUser } from "./devices.controller.js";
import { validateDeviceId, validateDeviceUpdate, validateUserId } from "../../middlewares/device-validation.js";

const router = Router();

router.get('/:deviceId', validateDeviceId, getDeviceById);
router.get('/user/:userId', validateUserId, getDevicesByUser);
router.post('/register', registerDevice);
router.put('/update/:deviceId', validateDeviceUpdate, updateDevice);
router.put('/activate/:deviceId', validateDeviceId, changeDeviceStatus);
router.put('/deactivate/:deviceId', validateDeviceId, changeDeviceStatus);

export default router;
