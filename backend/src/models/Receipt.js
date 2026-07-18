import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

let db;

export const initDatabase = async () => {
    db = await open({
        filename: config.DATABASE_URL,
        driver: sqlite3.Database
    });
    
    await db.exec(`
        CREATE TABLE IF NOT EXISTS receipts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            txid TEXT UNIQUE NOT NULL,
            reference TEXT UNIQUE NOT NULL,
            amount REAL NOT NULL,
            resource TEXT NOT NULL,
            repo TEXT NOT NULL,
            status TEXT DEFAULT 'completed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    logger.info('Database initialized');
    return db;
};

export const ReceiptModel = {
    create: async (data) => {
        const result = await db.run(
            `INSERT INTO receipts (txid, reference, amount, resource, repo, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [data.txid, data.reference, data.amount, data.resource, data.repo, data.status || 'completed']
        );
        return { id: result.lastID, ...data };
    },
    
    getAll: async () => {
        return await db.all('SELECT * FROM receipts ORDER BY created_at DESC');
    },
    
    getByTxid: async (txid) => {
        return await db.get('SELECT * FROM receipts WHERE txid = ?', txid);
    },
    
    getByRepo: async (repo) => {
        return await db.all('SELECT * FROM receipts WHERE repo = ? ORDER BY created_at DESC', repo);
    },
    
    getStats: async () => {
        const result = await db.get(`
            SELECT 
                COUNT(*) as total,
                SUM(amount) as totalRevenue,
                AVG(amount) as avgAmount
            FROM receipts
            WHERE status = 'completed'
        `);
        return result || { total: 0, totalRevenue: 0, avgAmount: 0 };
    }
};