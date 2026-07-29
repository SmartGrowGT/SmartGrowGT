import dotenv from 'dotenv';
dotenv.config();

import { initServer, app } from './configs/app.js';

// Prevenir caídas drásticas del proceso en producción
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

// Iniciar base de datos / servidor local
console.log('Iniciando servidor de SmartGrowGT....');
initServer();

export default app;