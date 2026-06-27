import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDB } from './src/config/db.js';
import { logger } from './src/config/logger.js';
import healthRoutes from './src/routes/health.routes.js';
import carsRoutes from './src/routes/cars.routes.js';

const app = express();
const PORT = process.env.PORT || 4002;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(mongoSanitize()); // previne NoSQL injection (critério 15)

app.use('/health', healthRoutes);
app.use('/cars', carsRoutes);

app.listen(PORT, () => logger.info(`resource-service ouvindo na porta ${PORT}`));
connectDB(process.env.MONGO_URI);
