import Redis from 'ioredis';
import { logger } from './logger.js';

export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
redis.on('connect', () => logger.info('Redis conectado'));
redis.on('error', (err) => logger.error(`Redis erro: ${err.message}`));
