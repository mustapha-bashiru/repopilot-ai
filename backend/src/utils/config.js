import dotenv from 'dotenv';
dotenv.config();

export const config = {
    // Algorand
    ALGOD_SERVER: process.env.ALGOD_SERVER || 'https://testnet-api.algorand.cloud',
    ALGOD_PORT: parseInt(process.env.ALGOD_PORT) || 443,
    ALGOD_TOKEN: process.env.ALGOD_TOKEN || '',
    MERCHANT_ADDRESS: process.env.MERCHANT_ADDRESS,
    MERCHANT_PRIVATE_KEY: process.env.MERCHANT_PRIVATE_KEY,
    
    // x402
    X402_FACILITATOR_URL: process.env.X402_FACILITATOR_URL || 'https://x402.plausible.io',
    X402_API_KEY: process.env.X402_API_KEY,
    
    // AI
    AI_PROVIDER: process.env.AI_PROVIDER || 'openai',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    
    // GitHub
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    
    // Database
    DATABASE_URL: process.env.DATABASE_URL || './data/repopilot.db',
    
    // Server
    PORT: parseInt(process.env.PORT) || 3001,
    NODE_ENV: process.env.NODE_ENV || 'development'
};

// Validate required env vars
const required = [
    'MERCHANT_ADDRESS',
    'MERCHANT_PRIVATE_KEY',
    'OPENAI_API_KEY',
    'GITHUB_TOKEN'
];

required.forEach(key => {
    if (!config[key]) {
        console.error(` Missing required env: ${key}`);
        process.exit(1);
    }
});

console.log(' All environment variables validated');