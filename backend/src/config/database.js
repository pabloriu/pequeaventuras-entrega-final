import mysql from 'mysql2/promise';
import { env } from './env.js';

let config;

if (env.db.uri) {
  config = {
    uri: env.db.uri
  };
} else {
  config = {
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database
  };
}

export const pool = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});
