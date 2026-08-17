import algosdk from 'algosdk';
import { PeraWalletConnect } from '@perawallet/connect';
import { ExactAvmScheme } from '@x402-avm/avm/exact/client';
import {
    decodePaymentResponseHeader,
    wrapFetchWithPayment,
    x402Client
} from '@x402-avm/fetch';

// Full CAIP-2, short hash, and wildcard definitions
export const ALGORAND_TESTNET_NETWORK = 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI=';
export const ALGORAND_TESTNET_NETWORK_SHORT = 'algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe';
export const LORA_TESTNET_URL = 'https://lora.algokit.io/testnet/transaction';

export const peraWallet = new PeraWalletConnect({
    chainId: 416002,
    shouldShowSignTxnToast: true
});

export const connectPeraWallet = async () => {
    const accounts = await peraWallet.connect();
    if (!accounts[0]) throw new Error('Pera Wallet did not return an account');
    return accounts[0];
};

export const reconnectPeraWallet = async () => {
    const accounts = await peraWallet.reconnectSession();
    return accounts[0] || null;
};

export const disconnectPeraWallet = () => peraWallet.disconnect();

const createPeraSigner = address => ({
    address,
    async signTransactions(encodedTransactions, indexesToSign) {
        const signIndexes = new Set(
            indexesToSign || encodedTransactions.map((_, index) => index)
        );
        const transactionGroup = encodedTransactions.map((encoded, index) => ({
            txn: algosdk.decodeUnsignedTransaction(encoded),
            signers: signIndexes.has(index) ? [address] : []
        }));

        const signed = await peraWallet.signTransaction([transactionGroup], address);
        let signedIndex = 0;

        return encodedTransactions.map((_, index) =>
            signIndexes.has(index) ? signed[signedIndex++] : null
        );
    }
});

export const createPaymentFetch = address => {
    const scheme = new ExactAvmScheme(createPeraSigner(address), {
        algodUrl: process.env.REACT_APP_ALGOD_URL || 'https://testnet-api.algonode.cloud'
    });

    // Register full CAIP-2, truncated string, and wildcard pattern 'algorand:*'
    const client = new x402Client()
        .register(ALGORAND_TESTNET_NETWORK, scheme)
        .register(ALGORAND_TESTNET_NETWORK_SHORT, scheme)
        .register('algorand:*', scheme);

    return wrapFetchWithPayment(window.fetch.bind(window), client);
};

export const getSettlement = response => {
    const header = response.headers.get('PAYMENT-RESPONSE') || response.headers.get('payment-response');
    return header ? decodePaymentResponseHeader(header) : null;
};

export const getLoraTransactionUrl = txid => `${LORA_TESTNET_URL}/${txid}`;