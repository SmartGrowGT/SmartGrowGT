import { Router } from 'express';

import {
    getAlerts,
    getAlertById,
    getAlertsByHardware,
    getAlertsByField,
    getBadAlerts,
    getAlertsByUser
} from './alertlog.controller.js';

import {
    validateGetAlertById,
    validateGetAlertsByHardware,
    validateGetAlertsByField
} from '../../middlewares/alertlog-validators.js';

const router = Router();

router.get('/', getAlerts);

router.get('/malas', getBadAlerts);

router.get('/user/:userId', getAlertsByUser);

router.get('/:id', validateGetAlertById, getAlertById);

router.get('/device/:deviceId', validateGetAlertsByHardware, getAlertsByHardware);

router.get('/field/:fieldId', validateGetAlertsByField, getAlertsByField);

export default router;