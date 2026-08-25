import { createApp } from './app.js';
import { ENV } from './config/env.js';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  console.log(`Backend API Server running at http://localhost:${ENV.PORT}`);
  console.log(`Endpoints available at http://localhost:${ENV.PORT}/api`);
  console.log(`Health check at http://localhost:${ENV.PORT}/health`);
});

// Manejo de apagado elegante (Graceful Shutdown)
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido. Cerrando servidor HTTP...');
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido. Cerrando servidor HTTP...');
  server.close(() => {
    console.log('Servidor HTTP cerrado.');
    process.exit(0);
  });
});
