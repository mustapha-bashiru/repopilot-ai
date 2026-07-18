import { x402Service } from '../services/x402.js';
import { config } from '../utils/config.js';

// Known resources and their prices
const RESOURCE_PRICES = {
    '/pitch-deck': 0.02,
    '/security-audit': 0.03,
    '/architecture': 0.02,
    '/investor-score': 0.01,
    '/readme-rewrite': 0.01,
    '/dependency-audit': 0.02,
    '/market-analysis': 0.04,
    '/demo-script': 0.01
};

/**
 * x402 Payment Middleware
 * Checks for payment receipt, returns 402 if missing
 */
export const x402Middleware = async (req, res, next) => {
    // Skip for health check
    if (req.path === '/health') return next();
    
    const resourcePath = req.path;
    const receipt = req.headers['x-payment-receipt'];
    
    // Check if this resource requires payment
    const price = RESOURCE_PRICES[resourcePath];
    if (!price) {
        // Free endpoint 
        return next();
    }
    
    // If no receipt, return 402
    if (!receipt) {
        const requirements = x402Service.generatePaymentRequirements(
            resourcePath,
            price,
            { repo: req.body.repo }
        );
        return res.status(402).json(requirements);
    }
    
    // Parse receipt if it's a string
    let receiptData;
    try {
        receiptData = typeof receipt === 'string' ? JSON.parse(receipt) : receipt;
    } catch {
        return res.status(400).json({ error: 'Invalid receipt format' });
    }
    
    // Verify payment
    const verification = await x402Service.verifyPayment(receiptData);
    
    if (!verification.verified) {
        return res.status(402).json({
            error: 'Payment verification failed',
            status: 402,
            payment_requirements: {
                facilitator: config.X402_FACILITATOR_URL,
                merchant: config.MERCHANT_ADDRESS,
                amount: price,
                asset: 'ALGO',
                reference: receiptData.reference || 'retry'
            }
        });
    }
    
    // Payment verified! Attach receipt to request
    req.payment = {
        receipt: receiptData,
        verification: verification,
        amount: price,
        resource: resourcePath
    };
    
    next();
};