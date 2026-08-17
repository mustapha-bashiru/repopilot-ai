import { paymentMiddlewareFromHTTPServer } from '@x402-avm/express';
import { ExactAvmScheme } from '@x402-avm/avm/exact/server';
import {
    HTTPFacilitatorClient,
    x402HTTPResourceServer,
    x402ResourceServer
} from '@x402-avm/core/server';
import { ReceiptModel } from '../models/Receipt.js';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

// Full CAIP-2 Genesis Hash for Algorand Testnet
export const ALGORAND_TESTNET_NETWORK = 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
export const USDC_TESTNET_ASA_ID = '10458941';

const RESOURCE_PRICES = {
    '/api/pitch-deck': 0.02,
    '/api/security-audit': 0.03,
    '/api/architecture': 0.02,
    '/api/investor-score': 0.01,
    '/api/readme-rewrite': 0.01,
    '/api/dependency-audit': 0.02,
    '/api/market-analysis': 0.04,
    '/api/demo-script': 0.01
};

const facilitatorClient = new HTTPFacilitatorClient({
    url: config.X402_FACILITATOR_URL
});

export const resourceServer = new x402ResourceServer(facilitatorClient)
    .register(ALGORAND_TESTNET_NETWORK, new ExactAvmScheme());

resourceServer.onAfterSettle(async ({ requirements, result, transportContext }) => {
    if (!result.success || !result.transaction) return;

    const request = transportContext?.request;
    const body = request?.adapter?.getBody?.();
    const amount = Number(requirements.amount) / 1_000_000;

    try {
        await ReceiptModel.create({
            txid: result.transaction,
            sender: requirements.sender,
            reference: result.transaction,
            amount,
            resource: request?.path || 'unknown',
            repo: body?.repo || 'unknown',
            status: 'completed'
        });
    } catch (error) {
        if (error?.code === 'SQLITE_CONSTRAINT') return;
        logger.error('Failed to persist settled x402 payment:', error.message);
    }
});

const paidRoutes = Object.fromEntries(
    Object.entries(RESOURCE_PRICES).map(([route, price]) => [
        `POST ${route}`,
        {
            accepts: {
                scheme: 'exact', // ExactAvmScheme registers as 'exact', not 'exact-asa'
                price: `$${price.toFixed(2)}`,
                network: ALGORAND_TESTNET_NETWORK,
                asset: USDC_TESTNET_ASA_ID, // Target USDC ASA ID
                payTo: config.MERCHANT_ADDRESS,
                maxTimeoutSeconds: 120
            },
            description: `RepoPilot repository analysis: ${route.split('/').at(-1)}`,
            mimeType: 'application/json'
        }
    ])
);

const httpResourceServer = new x402HTTPResourceServer(resourceServer, paidRoutes);

// Do not report the API as ready until facilitator capabilities and routes are valid.
await httpResourceServer.initialize();

export const x402Middleware = paymentMiddlewareFromHTTPServer(
    httpResourceServer,
    undefined,
    undefined,
    false
);