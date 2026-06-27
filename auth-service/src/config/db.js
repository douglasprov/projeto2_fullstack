import mongoose from 'mongoose';
import { logger } from './logger.js';

// Conexão MongoDB com POOL de conexões (critério 22)
export async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { maxPoolSize: 10, minPoolSize: 2, serverSelectionTimeoutMS: 5000 });
    logger.info('MongoDB conectado (auth_db)');
  } catch (err) {
    logger.error(`Falha ao conectar no MongoDB: ${err.message}`);
  }
}
