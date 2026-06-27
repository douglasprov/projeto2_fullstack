import Redis from 'ioredis';
import { logger } from './logger.js';

// Usado para cache (get/set) e para PUBLICAR eventos na fila
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on('connect', () => logger.info('Redis conectado'));
redis.on('error', (err) => logger.error(`Redis erro: ${err.message}`));
