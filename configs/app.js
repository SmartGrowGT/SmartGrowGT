'use strict';

// Importaciones
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { cordOptions } from './cors-configuration.js';
import { dbConnection } from './db.js';
import deviceRoutes from '../src/Devices/devices.routes.js';
import cultivosRoutes from '../src/Crops/crops.routes.js'

import usuarioRoutes from '../src/Users/users.router.js';
import fieldRoutes from '../src/Fields/fields.routes.js';
import alertLogRoutes from '../src/AlertLogs/alertlog.routes.js';
import reportsRoutes from '../src/Reports/reports.routes.js';
import sensorDataRoutes from '../src/SensorData/sensordata.routes.js';

const BASE_URL = '/smartgrowgt/v1';

// Configuración de middlewares
const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(cordOptions));
    app.use(morgan('dev'));
}

// Integración de rutasS
const routes = (app) => {
    app.use(`${BASE_URL}/devices`, deviceRoutes);
    app.use(`${BASE_URL}/usuarios`, usuarioRoutes);
    app.use(`${BASE_URL}/fields`, fieldRoutes);
    app.use(`${BASE_URL}/cultivos`, cultivosRoutes);
    app.use(`${BASE_URL}/alerts`, alertLogRoutes);
    app.use(`${BASE_URL}/reports`, reportsRoutes);
    app.use(`${BASE_URL}/sensordata`, sensorDataRoutes);
};

// Iniciar servidor
const initServer = async (app) => {

    app = express();
    const PORT = process.env.PORT || 3001;

    try {
        dbConnection();
        middlewares(app);
        routes(app);

        app.listen(PORT, () => {
            console.log(`El servidor está en el puerto ${PORT}`);
            console.log(`Base URL : http://localhost:${PORT}${BASE_URL}`);
        });

        app.get(`${BASE_URL}/health`, (req, res) => {
            res.status(200).json({
                status: 'ok',
                service: 'SmartGrowGT',
                version: '1.0.0'
            });
        });

    } catch (error) {
        console.log(error);
    }
}

export { initServer };
