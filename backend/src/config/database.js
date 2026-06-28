import mysql from 'mysql2/promise';
import { env } from './env.js';

const poolOptions = env.db.uri
  ? {
      uri: env.db.uri
    }
  : {
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database
    };

export const pool = mysql.createPool({
  ...poolOptions,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});
