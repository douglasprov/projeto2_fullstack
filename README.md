# Projeto 2 — Car Finder Fullstack

Aplicação fullstack distribuída: SPA React + 3 microsserviços (auth, resource, notification), fila de mensagens (Redis Pub/Sub) e notificações em tempo real via WebSocket.

UTFPR — Programação Web Fullstack.

## Arquitetura

| Componente | Tecnologia | Porta |
|---|---|---|
| frontend | React + Vite | 5173 |
| auth-service | Express | 4001 |
| resource-service | Express | 4002 |
| notification-service | Express + WebSocket | 4003 |
| Fila + cache | Redis | 6379 |
| Banco (auth_db, resource_db) | MongoDB | 27017 |

## Pré-requisitos
- Node.js 20+
- Docker + Docker Compose

## Como subir (linha de comando)

    docker composgite up -d
    npm install
    npm run install:all
    npm run seed
    npm run dev

Acesse o frontend em http://localhost:5173

## Usuários de teste
- douglas / senha123
- maria / senha123

## Onde está cada requisito (para avaliação)
- JWT / login / logout / rate limit: auth-service/src/routes/auth.routes.js
- Senha com hash+salt (bcrypt): auth-service/src/config/seed.js
- CRUD + verificação de dono (403): resource-service/src/routes/cars.routes.js
- Publica eventos na fila: cars.routes.js (publicarEvento)
- Consome a fila + WebSocket: notification-service/src/models/subscriber.js
- resource consultando auth: resource-service/src/config/auth.js
- Sanitização (XSS + NoSQL): sanitize.js + express-mongo-sanitize
- Cache e pool: cars.routes.js e config/db.js
- Logs centralizados: config/logger.js

## Bibliotecas (aprovar com o professor)
express, mongoose, jsonwebtoken, bcryptjs, ws, ioredis, express-rate-limit, helmet, express-mongo-sanitize, xss, compression, winston, cors, dotenv, concurrently — banco: MongoDB, fila: Redis.