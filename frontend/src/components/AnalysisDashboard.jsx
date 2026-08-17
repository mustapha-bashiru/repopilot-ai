import React, { useState } from 'react';
import ResultModal from './ResultModal';

const ANALYSES = [
    { id: 'pitch-deck', label: 'Pitch Deck', price: 0.02, icon: '📊' },
    { id: 'security-audit', label: 'Security Audit', price: 0.03, icon: '🛡️' },
    { id: 'architecture', label: 'Architecture', price: 0.02, icon: '🏗️' },
    { id: 'investor-score', label: 'Investor Score', price: 0.01, icon: '💎' },
    { id: 'readme-rewrite', label: 'README Rewrite', price: 0.01, icon: '📝' },
    { id: 'dependency-audit', label: 'Dependency Audit', price: 0.02, icon: '📦' },
    { id: 'market-analysis', label: 'Market Analysis', price: 0.04, icon: '🌍' },
    { id: 'demo-script', label: 'Demo Script', price: 0.01, icon: '🎬' }
];

function AnalysisDashboard({ repo, analyses, onAnalyze, loading }) {
    const repoName = repo.split('/').slice(-2).join('/');
    const [selectedResult, setSelectedResult] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);

    const handleViewResult = (result, feature) => {
        setSelectedResult(result);
        setSelectedFeature(feature);
    };

    return (
        <div className="dashboard">
            <h2> {repoName}</h2>
            <div className="payment-network-note" role="note">
                <strong>Payment on Algorand Testnet</strong>
                <span>
                    Analysis prices are paid in Testnet USDC (ASA 10458941).
                    Keep a small Testnet ALGO balance for the network fee.
                </span>
            </div>
            <div className="grid">
                {ANALYSES.map((analysis) => {
                    const result = analyses[`/${analysis.id}`];
                    const isLoading = loading[`/${analysis.id}`] || false; 
                    
                    return (
                        <div key={analysis.id} className={`card ${result ? 'analyzed' : ''}`}>
                            <div className="card-header">
                                <span className="icon">{analysis.icon}</span>
                                <h3>{analysis.label}</h3>
                            </div>
                            <div className="card-body">
                                <p className="price">${analysis.price.toFixed(2)} USDC</p>
                                {result ? (
                                    <div className="result">
                                        <button
                                            className="view-btn"
                                            onClick={() => handleViewResult(result, analysis.label)}
                                        >
                                            ✅ View Result
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="analyze-btn"
                                        onClick={() => onAnalyze(repo, `/${analysis.id}`)}
                                        disabled={isLoading} 
                                    >
                                        {isLoading ? '⏳ Processing...' : `Analyze ($${analysis.price.toFixed(2)} USDC)`}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedResult && (
                <ResultModal
                    result={selectedResult}
                    feature={selectedFeature}
                    onClose={() => setSelectedResult(null)}
                />
            )}
        </div>
    );
}

export default AnalysisDashboard;