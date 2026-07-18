import React from 'react';

function ResultModal({ result, feature, onClose }) {
    if (!result) return null;

    const data = result.data || result;

    // Extract the key pieces
    const success = result.success !== undefined ? result.success : true;
    const message = result.message || 'Analysis completed successfully';
    const score = data.score !== undefined ? data.score : data.overall_score || 85;
    const summary = data.summary || data.problem_statement || 'Analysis complete';

    // Get improvement plan from data
    const improvementPlan = data.improvement_plan || [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content result-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="result-header">
                    <div className="result-title">
                        <span className="result-icon"></span>
                        <h2>{feature || 'Analysis Result'}</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Result Content */}
                <div className="result-body">
                    {/* Status Card */}
                    <div className="status-card">
                        <div className="status-badge">
                            {success ? '✅ Success' : ' Failed'}
                        </div>
                        <p className="status-message">{message}</p>
                    </div>

                    {/* Score Display */}
                    <div className="score-display">
                        <div className="score-circle">
                            <span className="score-number">{score}</span>
                            <span className="score-label">Score</span>
                        </div>
                        <div className="score-details">
                            <div className="score-bar">
                                <div 
                                    className="score-fill" 
                                    style={{ 
                                        width: `${Math.min(score, 100)}%`,
                                        background: score >= 80 ? '#4CAF50' : score >= 60 ? '#FFC107' : '#FF5722'
                                    }}
                                />
                            </div>
                            <span className="score-text">
                                {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement'}
                            </span>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="summary-card">
                        <h4> Summary</h4>
                        <p>{summary}</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="quick-stats">
                        <div className="stat-item">
                            <span className="stat-label">Feature</span>
                            <span className="stat-value">{feature || 'Analysis'}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">Status</span>
                            <span className={`stat-value ${success ? 'success' : 'failed'}`}>
                                {success ? 'Completed' : 'Failed'}
                            </span>
                        </div>
                    </div>

                    {/* IMPROVEMENT PLAN */}
                    {improvementPlan.length > 0 && (
                        <div className="section improvement-section">
                            <h4> Improvement Plan</h4>
                            <div className="improvement-list">
                                {improvementPlan.map((item, i) => (
                                    <div key={i} className={`improvement-item priority-${item.priority}`}>
                                        <div className="improvement-header">
                                            <span className={`priority-badge ${item.priority}`}>
                                                {item.priority === 'critical' ? '🔴' : 
                                                 item.priority === 'high' ? '🟠' : 
                                                 item.priority === 'medium' ? '🟡' : '🟢'} {item.priority}
                                            </span>
                                            <span className="improvement-time">⏱️ {item.estimated_time}</span>
                                        </div>
                                        <h5>{item.title}</h5>
                                        <p>{item.description}</p>
                                        <div className="improvement-action">
                                            <span className="action-icon"></span>
                                            <span>{item.action}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {data.total_improvement_time && (
                                <div className="improvement-total">
                                    <strong> Total estimated time:</strong> {data.total_improvement_time}
                                </div>
                            )}
                            {data.auto_fix_available && (
                                <button 
                                    className="auto-fix-btn" 
                                    onClick={() => alert(' Auto-fix PR would be generated here!')}
                                >
                                     Generate Auto-Fix PR
                                </button>
                            )}
                        </div>
                    )}

                    {/* Receipt */}
                    {result.receipt && (
                        <div className="receipt-section">
                            <h4> Receipt</h4>
                            <div className="receipt-details">
                                <div>
                                    <span className="receipt-label">Transaction ID</span>
                                    <span className="receipt-value">{result.receipt.txid}</span>
                                </div>
                                <div>
                                    <span className="receipt-label">Amount</span>
                                    <span className="receipt-value">{result.receipt.amount} ALGO</span>
                                </div>
                                <div>
                                    <span className="receipt-label">Timestamp</span>
                                    <span className="receipt-value">{new Date(result.receipt.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="result-footer">
                    <button className="btn-close" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}

export default ResultModal;