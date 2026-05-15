import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

import { initServer } from './configs/app.js';

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