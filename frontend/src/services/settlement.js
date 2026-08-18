import { decodePaymentResponseHeader } from '@x402-avm/fetch';

export const getSettlement = response => {
    const header = response.headers.get('PAYMENT-RESPONSE') || response.headers.get('payment-response');
    return header ? decodePaymentResponseHeader(header) : null;
};

export const requireSettlement = response => {
    const settlement = getSettlement(response);

    if (!settlement?.transaction) {
        throw new Error('Payment settlement could not be verified. Analysis result was not accepted.');
    }

    return settlement;
};