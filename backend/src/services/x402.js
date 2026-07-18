import algosdk from 'algosdk';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../utils/config.js';    
import { logger } from '../utils/logger.js';  

class X402Service {
    constructor() {
        this.algodClient = new algosdk.Algodv2(
            config.ALGOD_TOKEN || '',
            config.ALGOD_SERVER,
            config.ALGOD_PORT
        );
        this.facilitatorUrl = config.X402_FACILITATOR_URL;
        this.merchantAddress = config.MERCHANT_ADDRESS;
    }

    generatePaymentRequirements(resource, amount, metadata = {}) {
        const reference = uuidv4();
        return {
            status: 402,
            payment_requirements: {
                facilitator: this.facilitatorUrl,
                merchant: this.merchantAddress,
                amount: amount,
                asset: 'ALGO',
                reference: reference,
                resource: resource,
                timestamp: Date.now(),
                metadata: metadata
            }
        };
    }

    async verifyPayment(receipt) {
        try {
            const response = await axios.post(
                `${this.facilitatorUrl}/verify`,
                { receipt },
                {
                    headers: {
                        'X-API-Key': config.X402_API_KEY || ''
                    }
                }
            );
            
            return {
                verified: response.data.verified,
                txid: receipt.txid,
                amount: response.data.amount,
                timestamp: response.data.timestamp
            };
            
        } catch (error) {
            logger.warn('Facilitator verification failed, using direct verification');
            return await this.verifyDirectly(receipt);
        }
    }

    async verifyDirectly(receipt) {
    try {
        // HACKATHON DEMO: Accept DEMO_* transactions without real verification
        if (receipt.txid && receipt.txid.startsWith('DEMO_')) {
            return {
                verified: true,
                txid: receipt.txid,
                amount: receipt.amount || 0.01,
                timestamp: new Date().toISOString()
            };
        }

        // REAL: Verify on Algorand
        const txInfo = await this.algodClient
            .pendingTransactionInformation(receipt.txid)
            .do();
        
        const paymentTx = txInfo.txn.txn;
        const isCorrectRecipient = paymentTx.to === this.merchantAddress;
        const isConfirmed = txInfo.confirmedRound > 0;
        
        return {
            verified: isCorrectRecipient && isConfirmed,
            txid: receipt.txid,
            amount: paymentTx.amt / 1_000_000,
            timestamp: new Date(txInfo.confirmedRound * 2.8).toISOString()
        };
        
    } catch (error) {
        // If real verification fails, try demo mode
        if (receipt.txid && receipt.txid.startsWith('DEMO_')) {
            return {
                verified: true,
                txid: receipt.txid,
                amount: receipt.amount || 0.01,
                timestamp: new Date().toISOString()
            };
        }
        throw error;
    }
}
    generateReceipt(txid, reference, amount, resource) {
        return {
            receipt: {
                txid: txid,
                reference: reference,
                amount: amount,
                asset: 'ALGO',
                resource: resource,
                timestamp: new Date().toISOString(),
                merchant: this.merchantAddress,
                verifier: this.facilitatorUrl
            }
        };
    }
}

export const x402Service = new X402Service();