import { decodePaymentResponseHeader } from '@x402-avm/fetch';
import { getSettlement, requireSettlement } from './settlement';

jest.mock('@x402-avm/fetch', () => ({
    decodePaymentResponseHeader: jest.fn(),
    wrapFetchWithPayment: jest.fn(),
    x402Client: jest.fn()
}));

const responseWithHeader = value => ({
    headers: {
        get: jest.fn(name => name === 'PAYMENT-RESPONSE' ? value : null)
    }
});

describe('x402 settlement validation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('returns a decoded settlement with a transaction', () => {
        const settlement = { success: true, transaction: 'TX123' };
        decodePaymentResponseHeader.mockReturnValue(settlement);

        expect(requireSettlement(responseWithHeader('encoded'))).toEqual(settlement);
    });

    test('rejects a successful response without a payment receipt', () => {
        expect(() => requireSettlement(responseWithHeader(null))).toThrow(
            'Payment settlement could not be verified'
        );
    });

    test('rejects a decoded response without a transaction id', () => {
        decodePaymentResponseHeader.mockReturnValue({ success: true });

        expect(() => requireSettlement(responseWithHeader('encoded'))).toThrow(
            'Payment settlement could not be verified'
        );
    });

    test('keeps nullable receipt decoding available for non-paid callers', () => {
        expect(getSettlement(responseWithHeader(null))).toBeNull();
    });
});