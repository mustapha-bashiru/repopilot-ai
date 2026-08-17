import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';

import { x402Middleware } from './middleware/payment.js';
import { createRoutes } from './routes/index.js';
import { initDatabase } from './models/Receipt.js';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());

// Expose x402 response headers so browser clients can parse 402 Payment Required metadata
const allowedOrigins = [
    'https://repopilot-ai.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Fallback: allow dynamically for dev/preview branches
        }
    },
    credentials: true,
    exposedHeaders: [
        'WWW-Authenticate',
        'Server-Authorization',
        'X-Payment-Required',
        'x-payment-required',
        'PAYMENT-REQUIRED',
        'payment-required',
        'PAYMENT-RESPONSE',
        'payment-response'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'PAYMENT-SIGNATURE',
        'payment-signature',
        'X-PAYMENT',
        'x-payment',
        'X-Payment-Response',
        'Access-Control-Expose-Headers',
        'access-control-expose-headers'
    ]
}));

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
app.use(x402Middleware);
app.use('/api', routes);

app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    logger.info(` RepoPilot AI backend running on port ${PORT}`);
    logger.info(` x402 facilitator: ${config.X402_FACILITATOR_URL}`);
    logger.info(` Algorand network: Testnet (USDC ASA 10458941)`);
    logger.info(` http://localhost:${PORT}`);
});