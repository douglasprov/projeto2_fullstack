import Redis from 'ioredis';
import { logger } from '../config/logger.js';

// Consome eventos do canal 'car-events' e chama onEvent para cada um (critério 9)
export function iniciarConsumidor(onEvent) {
  const sub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  sub.subscribe('car-events', (err) => {
    if (err) logger.error(`Erro ao assinar fila: ${err.message}`);
    else logger.info('Inscrito no canal car-events');
  });
  sub.on('message', (channel, message) => {
    logger.info(`Evento recebido da fila: ${message}`);
    try {
      onEvent(JSON.parse(message));
    } catch (e) {
      logger.error(`Evento inválido: ${e.message}`);
    }
  });
}