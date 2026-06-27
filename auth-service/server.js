import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { connectDB } from './src/config/db.js';
import { logger } from './src/config/logger.js';
import healthRoutes from './src/routes/health.routes.js';
import authRoutes from './src/routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(helmet());
app.use(cors());
app.use(compression()); // compressão das respostas HTTP (critério 20)
app.use(express.json());

app.use('/health', healthRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => logger.info(`auth-service ouvindo na porta ${PORT}`));
connectDB(process.env.MONGO_URI);
