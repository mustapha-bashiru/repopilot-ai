import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

import { x402Middleware } from './middleware/payment.js';
import { createRoutes } from './routes/index.js';
import { initDatabase } from './models/Receipt.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP'
});
app.use('/api', limiter);

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

await initDatabase();

const routes = createRoutes();
app.use('/api', x402Middleware, routes);

app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    logger.info(` RepoPilot AI backend running on port ${PORT}`);
    logger.info(` x402 facilitator: ${process.env.X402_FACILITATOR_URL}`);
    logger.info(` http://localhost:${PORT}`);
});