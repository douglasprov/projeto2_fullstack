import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  defaultMeta: { service: 'resource-service' },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((i) => `${i.timestamp} [${i.service}] ${i.level}: ${i.message}`)
  ),
  transports: [new winston.transports.Console()],
});
s