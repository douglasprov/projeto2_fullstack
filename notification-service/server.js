import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import http from 'http';
import { WebSocketServer } from 'ws';
import { logger } from './src/config/logger.js';
import healthRoutes from './src/routes/health.routes.js';
import { iniciarConsumidor } from './src/models/subscriber.js';

const app = express();
const PORT = process.env.PORT || 4003;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use('/health', healthRoutes);

// HTTP + WebSocket no mesmo servidor (RF6)
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', () => logger.info(`Cliente WebSocket conectado (total: ${wss.clients.size})`));

// Envia a mensagem para todos os clientes conectados
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((c) => { if (c.readyState === 1) c.send(msg); });
}

// Consome a fila e retransmite via WebSocket
iniciarConsumidor((evento) => broadcast(evento));

server.listen(PORT, () => logger.info(`notification-service ouvindo na porta ${PORT} (HTTP + WebSocket)`));
