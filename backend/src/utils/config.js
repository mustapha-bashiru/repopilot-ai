import dotenv from 'dotenv';
import algosdk from 'algosdk';
dotenv.config();

export const config = {
    // Algorand
    ALGOD_SERVER: process.env.ALGOD_SERVER || 'https://testnet-api.algonode.cloud',
    ALGOD_PORT: parseInt(process.env.ALGOD_PORT) || 443,
    ALGOD_TOKEN: process.env.ALGOD_TOKEN || '',
    MERCHANT_ADDRESS: process.env.MERCHANT_ADDRESS,
    
    // x402
    X402_FACILITATOR_URL: process.env.X402_FACILITATOR_URL || 'https://facilitator.goplausible.xyz',
    
    // AI
    AI_PROVIDER: process.env.AI_PROVIDER || 'openai',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    
    // GitHub
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    
    // Database
    DATABASE_URL: process.env.DATABASE_URL || './data/repopilot.db',
    
    // Server
    PORT: parseInt(process.env.PORT) || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

// Validate required env vars
const required = [
    'MERCHANT_ADDRESS',
    'OPENAI_API_KEY',
    'GITHUB_TOKEN'
];

required.forEach(key => {
    if (!config[key]) {
        console.error(` Missing required env: ${key}`);
        process.exit(1);
    }
});

if (!algosdk.isValidAddress(config.MERCHANT_ADDRESS)) {
    console.error(' MERCHANT_ADDRESS must be a valid Algorand address');
    process.exit(1);
}

try {
    new URL(config.X402_FACILITATOR_URL);
} catch {
    console.error(' X402_FACILITATOR_URL must be a valid URL');
    process.exit(1);
}

console.log(' All environment variables validated');