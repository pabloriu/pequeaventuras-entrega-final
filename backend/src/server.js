import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { pool } from './config/database.js';
import apiRoutes from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const uploadsPath = path.resolve(process.cwd(), env.uploadsDir);

app.disable('x-powered-by');

app.use(cors({
  origin(origin, callback) {
    const isLocalDevOrigin =
      env.nodeEnv !== 'production' &&
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || '');

    if (!origin || env.corsOrigins.includes(origin) || isLocalDevOrigin) {
      callback(null, true);
      return;
    }

    callback(new Error('Origen no permitido por CORS'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/uploads', express.static(uploadsPath));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'PequeAventuras' });
});

app.use('/api', apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  app.listen(env.port, () => {
    console.log(`PequeAventuras backend running on port ${env.port}`);
  });

  pool.query('SELECT 1').catch((error) => {
    console.error('MySQL connection check failed:', error.message);
  });
}

startServer().catch((error) => {
  console.error('Could not start PequeAventuras backend:', error);
  process.exit(1);
});
