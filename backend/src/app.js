import 'dotenv/config'; // Must run BEFORE config.js and other modules import process.env
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import { x402Middleware } from './middleware/payment.js';
import { createRoutes } from './routes/index.js';
import { initDatabase } from './models/Receipt.js';
import { config } from './utils/config.js';
import { logger } from './utils/logger.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Allow cross-origin resource sharing through Helmet
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Trust reverse proxy for rate limiting (Render/Vercel)
app.set('trust proxy', 1);

// Allowed origins configuration supporting Render and Vercel domains
const allowedOrigins = [
    'https://repopilot-ai.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(cors({
    origin: (origin, callback) => {
        // Automatically allow Render, Vercel, and localhost cross-origin requests
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.onrender.com') || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(null, true); // Fallback for dynamic preview deployments
        }
    },
    credentials: true,
    exposedHeaders: [
        'WWW-Authenticate',
        'www-authenticate',
        'Server-Authorization',
        'server-authorization',
        'X-Payment-Required',
        'x-payment-required',
        'PAYMENT-REQUIRED',
        'payment-required',
        'PAYMENT-RESPONSE',
        'payment-response',
        'X-Payment-Response',
        'x-payment-response',
        'Location',
        'location'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'PAYMENT-SIGNATURE',
        'payment-signature',
        'X-PAYMENT',
        'x-payment',
        'X-Payment-Response',
        'x-payment-response',
        'Access-Control-Expose-Headers',
        'access-control-expose-headers'
    ]
}));

app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

await initDatabase();

// x402 must run before the /api mount so req.path retains the /api prefix used
// by the protected route table. Unmatched API routes pass through unchanged.
const routes = createRoutes();
app.use(x402Middleware);
app.use('/api', routes);

// Enhanced Error Handler to expose server error details in Vercel logs
app.use((err, req, res, next) => {
    logger.error('Unhandled server error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

app.listen(PORT, () => {
    logger.info(` RepoPilot AI backend running on port ${PORT}`);
    logger.info(` x402 facilitator: ${config.X402_FACILITATOR_URL}`);
    logger.info(` Algorand network: Testnet (USDC ASA 10458941)`);
});