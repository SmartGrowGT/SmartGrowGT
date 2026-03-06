// Importaciones
import dotenv from 'dotenv';
import { initServer } from './configs/app.js';

// Configurar las vaibles de enetorno
dotenv.config();

// errores no capturados
process.on('uncaughtException', (error) => {
    console.log(error);
    process.exit(1);
});
// errores no manejados en promesas
process.on('unhandledRejection', (reason, promise) => {
    console.log(reason, promise);
    process.exit(1);
});
// Iniciar el servidor
console.log('Iniciando servidor de SmartGrowGT....');
initServer();