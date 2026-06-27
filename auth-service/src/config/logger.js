import winston from 'winston';

// Logger centralizado com identificação do serviço (critério 18)
export const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'auth-service' },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((i) => `${i.timestamp} [${i.service}] ${i.level}: ${i.message}`)
  ),
  transports: [new winston.transports.Console()],
});
