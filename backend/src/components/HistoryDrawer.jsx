import React from 'react';

function HistoryDrawer({ isOpen, onClose, history }) {
  if (!isOpen) return null;

  const totalSpent = history
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
    .toFixed(2);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Transaction History</h3>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Total Spent Summary Metric */}
        <div className="drawer-summary">
          <div>
            <span>Total Reports</span>
            <strong>{history.length}</strong>
          </div>
          <div>
            <span>Total Spent</span>
            <strong>${totalSpent} USDC</strong>
          </div>
        </div>

        {/* History Table / List */}
        <div className="drawer-list">
          {history.length === 0 ? (
            <p className="empty-text">No previous transactions found.</p>
          ) : (
            history.map((tx) => (
              <div key={tx.txid} className="history-item">
                <div className="history-main">
                  <strong>{tx.resource.replace('/', '')}</strong>
                  <span className="repo-tag">{tx.repo}</span>
                </div>
                <div className="history-meta">
                  <span className="amount">${tx.amount} USDC</span>
                  <a
                    href={`https://lora.algokit.io/testnet/transaction/${tx.txid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="explorer-link"
                  >
                    View Tx ↗
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HistoryDrawer;