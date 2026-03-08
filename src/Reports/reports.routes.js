import { Router } from 'express';

import {
    getReports,
    getReportById,
    getReportsByField,
    getReportsByHardware,
    getBadReports
} from './reports.controller.js';

import {
    validateGetReportById,
    validateGetReportsByField,
    validateGetReportsByHardware
} from '../../middlewares/reports-validators.js';

const router = Router();

router.get('/', getReports);

router.get('/malas', getBadReports);

router.get('/:id', validateGetReportById, getReportById);

router.get('/field/:fieldId', validateGetReportsByField, getReportsByField);

router.get('/device/:deviceId', validateGetReportsByHardware, getReportsByHardware);

export default router;