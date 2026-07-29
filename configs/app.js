'use strict';

// Importaciones
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { cordOptions } from './cors-configuration.js';
import { dbConnection } from './db.js';
import deviceRoutes from '../src/Devices/devices.routes.js';
import cultivosRoutes from '../src/Crops/crops.routes.js';

import usuarioRoutes from '../src/Users/users.router.js';
import fieldRoutes from '../src/Fields/fields.routes.js';
import alertLogRoutes from '../src/AlertLogs/alertlog.routes.js';
import reportsRoutes from '../src/Reports/reports.routes.js';
import sensorDataRoutes from '../src/SensorData/sensordata.routes.js';
import productsRoutes from '../src/Products/products.routes.js';
import fertilizersRoutes from '../src/Fertilizers/fertilizers.routes.js';
import cartRoutes from '../src/Cart/cart.routes.js';
import ordersRoutes from '../src/Orders/orders.routes.js';
import fertilityRoutes from '../src/FertilityRecommendation/fertility.routes.js';
import aiAssistantRoutes from '../src/AIAssistant/aiAssistant.routes.js';

const BASE_URL = '/smartgrowgt/v1';

// Crear la instancia de Express fuera de initServer
const app = express();

// Configuración de middlewares
const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(cordOptions));
    app.use(morgan('dev'));
};

// Integración de rutas
const routes = (app) => {
    // Endpoint de salud (Health check)
    app.get(`${BASE_URL}/health`, (req, res) => {
        res.status(200).json({
            status: 'ok',
            service: 'SmartGrowGT',
            version: '1.0.0'
        });
    });

    app.use(`${BASE_URL}/devices`, deviceRoutes);
    app.use(`${BASE_URL}/usuarios`, usuarioRoutes);
    app.use(`${BASE_URL}/fields`, fieldRoutes);
    app.use(`${BASE_URL}/cultivos`, cultivosRoutes);
    app.use(`${BASE_URL}/alerts`, alertLogRoutes);
    app.use(`${BASE_URL}/reports`, reportsRoutes);
    app.use(`${BASE_URL}/sensordata`, sensorDataRoutes);
    app.use(`${BASE_URL}/products`, productsRoutes);
    app.use(`${BASE_URL}/fertilizers`, fertilizersRoutes);
    app.use(`${BASE_URL}/cart`, cartRoutes);
    app.use(`${BASE_URL}/orders`, ordersRoutes);
    app.use(`${BASE_URL}/fertility`, fertilityRoutes);
    app.use(`${BASE_URL}/ai-assistant`, aiAssistantRoutes);
};

// Cargar middlewares y rutas inmediatamente
middlewares(app);
routes(app);

// Iniciar servidor
const initServer = async () => {
    const PORT = process.env.PORT || 3001;

    try {
        await dbConnection();

        // Solo escucha puerto si estamos en entorno local (fuera de producción/Vercel)
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`El servidor está en el puerto ${PORT}`);
                console.log(`Base URL : http://localhost:${PORT}${BASE_URL}`);
            });
        }
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

export { initServer, app };