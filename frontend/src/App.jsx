import React, { useState } from 'react';
import RepoInput from './components/RepoInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import TransactionHistory from './components/TransactionHistory';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function App() {
    const [repo, setRepo] = useState('');
    const [analyses, setAnalyses] = useState({});
    const [loading, setLoading] = useState({});
    const [showHistory, setShowHistory] = useState(false);

    const submitPayment = async (requirements) => {
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
                resolve(receipt);
            }, 2000);
        });
    };

    const handleAnalyze = async (repoUrl, endpoint) => {
        setLoading(prev => ({ ...prev, [endpoint]: true }));
        
        try {
            const response = await fetch(`${API_URL}/api${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repo: repoUrl })
            });

            if (response.status === 402) {
                const paymentData = await response.json();
                const receipt = await submitPayment(paymentData.payment_requirements);
                localStorage.setItem('x402_receipt', JSON.stringify(receipt));

                const retry = await fetch(`${API_URL}/api${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Payment-Receipt': JSON.stringify(receipt)
                    },
                    body: JSON.stringify({ repo: repoUrl })
                });

                if (!retry.ok) {
                    throw new Error(`Retry failed with status ${retry.status}`);
                }

                const result = await retry.json();
                setAnalyses(prev => ({ ...prev, [endpoint]: result }));
            } else if (response.ok) {
                const result = await response.json();
                setAnalyses(prev => ({ ...prev, [endpoint]: result }));
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('Analysis failed:', error);
        } finally {
            setLoading(prev => ({ ...prev, [endpoint]: false }));
        }
    };

    // Check if ANY analysis is loading
    const isAnyLoading = Object.values(loading).some(v => v === true);

    return (
        <div className="app">
            <header className="header">
                <h1>RepoPilot AI</h1>
                <p>Intelligence-as-a-Service for GitHub Repositories</p>
                <button onClick={() => setShowHistory(!showHistory)}>
                    {showHistory ? 'Back to Analyzer' : 'Transaction History'}
                </button>
            </header>

            <main className="main">
                {showHistory ? (
                    <TransactionHistory />
                ) : (
                    <>
                        <RepoInput
                            onRepoSubmit={(url) => setRepo(url)}
                            loading={isAnyLoading}  // ← Boolean: true if any analysis is running
                        />
                        {repo && (
                            <AnalysisDashboard
                                repo={repo}
                                analyses={analyses}
                                onAnalyze={handleAnalyze}
                                loading={loading}  // ← Object: per-card loading
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default App;