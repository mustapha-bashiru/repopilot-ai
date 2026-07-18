import React, { useState } from 'react';

export const PaymentFlow = {
    submit: async (requirements) => {
        console.log('Submitting payment:', requirements);
        return new Promise((resolve) => {
            setTimeout(() => {
                const receipt = {
                    txid: 'DEMO_' + Math.random().toString(36).substring(7),
                    reference: requirements.reference,
                    amount: requirements.amount,
                    asset: requirements.asset,
                    timestamp: new Date().toISOString()
                };
                console.log('Payment submitted, receipt:', receipt);
                resolve(receipt);
            }, 2000);
        });
    }
};

export default function PaymentFlowUI({ requirements, onComplete, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePay = async () => {
        setLoading(true);
        setError(null);
        try {
            const receipt = await PaymentFlow.submit(requirements);
            if (onComplete) {
                onComplete(receipt);
            }
        } catch (err) {
            setError(err.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-modal">
            <div className="payment-card">
                <h2>Payment Required</h2>
                <p>
                    Pay {requirements?.amount} {requirements?.asset} to access this resource
                </p>

                <div className="payment-details">
                    <div>
                        <span>Amount:</span>
                        <strong>{requirements?.amount} {requirements?.asset}</strong>
                    </div>
                    <div>
                        <span>Merchant:</span>
                        <code>{requirements?.merchant?.slice(0, 10) || 'unknown'}...</code>
                    </div>
                </div>

                {error && <div className="payment-error">{error}</div>}

                <div className="payment-actions">
                    <button onClick={handlePay} disabled={loading}>
                        {loading ? 'Processing...' : 'Pay Now'}
                    </button>
                    {onCancel && (
                        <button onClick={onCancel} disabled={loading} className="secondary-btn">
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
