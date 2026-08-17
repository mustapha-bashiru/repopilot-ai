import React, { useState, useEffect } from 'react';
import { getLoraTransactionUrl } from '../services/x402';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, totalRevenue: 0, avgAmount: 0 });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch(`${API_URL}/api/transactions`);
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            const data = await response.json();
            setTransactions(data.transactions || []);
            setStats({
                total: data.total || 0,
                totalRevenue: data.totalRevenue || 0,
                avgAmount: data.avgAmount || 0
            });
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading transactions...</div>;
    }

    return (
        <div className="transaction-history">
            <div className="stats">
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p>{stats.totalRevenue.toFixed(4)} USDC</p>
                </div>
                <div className="stat-card">
                    <h3>Total Transactions</h3>
                    <p>{stats.total}</p>
                </div>
                <div className="stat-card">
                    <h3>Avg. Transaction</h3>
                    <p>{stats.avgAmount.toFixed(4)} USDC</p>
                </div>
            </div>

            <div className="transactions-table-wrapper" role="region" aria-label="Transaction history" tabIndex="0">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>TxID</th>
                            <th>Amount</th>
                            <th>Resource</th>
                            <th>Repo</th>
                            <th>Status</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id || tx.txid}>
                                <td className="txid">
                                    {tx.txid ? (
                                        <a href={getLoraTransactionUrl(tx.txid)} target="_blank" rel="noreferrer">
                                            {tx.txid.slice(0, 8)}...
                                        </a>
                                    ) : 'unknown'}
                                </td>
                                <td className="amount">{tx.amount} USDC</td>
                                <td className="resource">{tx.resource || 'unknown'}</td>
                                <td className="repo">{tx.repo?.split('/').slice(-1)[0] || 'unknown'}</td>
                                <td className="status">
                                    <span className={`badge ${tx.status || 'unknown'}`}>
                                        {tx.status || 'unknown'}
                                    </span>
                                </td>
                                <td className="timestamp">
                                    {tx.created_at ? new Date(tx.created_at).toLocaleString() : 'unknown'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {transactions.length === 0 && (
                <div className="empty">
                    <p>No transactions yet. Start analyzing repos.</p>
                </div>
            )}
        </div>
    );
}

export default TransactionHistory;
