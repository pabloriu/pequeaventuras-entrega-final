import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'dev_only_change_me';

if (nodeEnv === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'changeme_secret')) {
  throw new Error('JWT_SECRET debe configurarse con un valor seguro en produccion');
}

export const env = {
  port: process.env.PORT || 3000,
  nodeEnv,
  db: {
    uri: process.env.MYSQL_PUBLIC_URL || '',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pequeaventuras_db'
  },
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOrigins: (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  whatsappNumber: process.env.WHATSAPP_NUMBER || '51930700147',
  uploadsDir: process.env.UPLOADS_DIR || 'src/uploads'
};
