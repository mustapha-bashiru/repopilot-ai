const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

export const logger = {
    info: (msg, ...args) => {
        console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`, ...args);
    },
    warn: (msg, ...args) => {
        console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`, ...args);
    },
    error: (msg, ...args) => {
        console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`, ...args);
    },
    success: (msg, ...args) => {
        console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`, ...args);
    },
    debug: (msg, ...args) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`${colors.magenta}[DEBUG]${colors.reset} ${msg}`, ...args);
        }
    }
};