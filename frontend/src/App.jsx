import React, { useEffect, useState } from 'react';
import RepoInput from './components/RepoInput';
import AnalysisDashboard from './components/AnalysisDashboard';
import TransactionHistory from './components/TransactionHistory';
import {
    connectPeraWallet,
    createPaymentFetch,
    disconnectPeraWallet,
    getLoraTransactionUrl,
    getSettlement,
    reconnectPeraWallet
} from './services/x402';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Read active network from environment variables, defaulting to 'testnet'
const NETWORK = process.env.REACT_APP_ALGORAND_NETWORK || 'testnet';

const getNetworkLabel = (net) => {
    switch (net.toLowerCase()) {
        case 'mainnet':
            return 'Algorand Mainnet';
        case 'preview':
        case 'betanet':
            return 'Algorand Preview';
        default:
            return 'Algorand Testnet';
    }
};

function App() {
    const [repo, setRepo] = useState('');
    const [analyses, setAnalyses] = useState({});
    const [loading, setLoading] = useState({});
    const [showHistory, setShowHistory] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [showWalletMenu, setShowWalletMenu] = useState(false);
    const [error, setError] = useState(null);
    const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

    useEffect(() => {
        reconnectPeraWallet()
            .then(setWalletAddress)
            .catch(() => setWalletAddress(null));
    }, []);

    const handleConnect = async () => {
        setError(null);
        try {
            const address = await connectPeraWallet();
            setWalletAddress(address);
        } catch (walletError) {
            setError(walletError.message || 'Unable to connect Pera Wallet');
        }
    };

    const handleDisconnect = async () => {
        await disconnectPeraWallet();
        setWalletAddress(null);
        setShowWalletMenu(false);
    };

    const handleAnalyze = async (repoUrl, endpoint) => {
        setLoading(prev => ({ ...prev, [endpoint]: true }));
        setError(null);
        
        try {
            const payer = walletAddress || await connectPeraWallet();
            setWalletAddress(payer);
            const paymentFetch = createPaymentFetch(payer);
            const response = await paymentFetch(`${API_URL}/api${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ repo: repoUrl })
            });

            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.error || body.message || `Request failed with status ${response.status}`);
            }

            const result = await response.json();
            const settlement = getSettlement(response);
            
            setAnalyses(prev => ({
                ...prev,
                [endpoint]: {
                    ...result,
                    receipt: settlement?.transaction ? {
                        ...settlement,
                        txid: settlement.transaction,
                        loraUrl: getLoraTransactionUrl(settlement.transaction)
                    } : null
                }
            }));

            // Auto-refresh transaction history after successful payment
            setHistoryRefreshKey(prev => prev + 1);

        } catch (error) {
            console.error('Analysis failed:', error);
            setError(error.message || 'Analysis payment failed');
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
                <div className="header-actions">
                    <button 
                        className="history-toggle-btn"
                        onClick={() => setShowHistory(!showHistory)}
                    >
                        {showHistory ? 'Back to Analyzer' : 'Transaction History'}
                    </button>

                    {/* Wallet Control Dropdown */}
                    <div className="wallet-dropdown-wrapper">
                        {!walletAddress ? (
                            <button onClick={handleConnect} className="wallet-button">
                                Connect Pera Wallet
                            </button>
                        ) : (
                            <button 
                                onClick={() => setShowWalletMenu(!showWalletMenu)} 
                                className="wallet-button connected"
                            >
                                <span className="status-dot">●</span>
                                {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                                <span className="arrow-icon">{showWalletMenu ? '▲' : '▼'}</span>
                            </button>
                        )}

                        {/* Dropdown Menu */}
                        {walletAddress && showWalletMenu && (
                            <div className="wallet-dropdown-menu">
                                <div className="wallet-menu-header">
                                    <span className={`network-badge ${NETWORK.toLowerCase()}`}>
                                        {getNetworkLabel(NETWORK)}
                                    </span>
                                    <p className="full-address">{walletAddress}</p>
                                </div>
                                <button className="disconnect-btn" onClick={handleDisconnect}>
                                    Disconnect Wallet
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="main">
                {error && <div className="payment-error" role="alert">{error}</div>}
                
                {showHistory ? (
                    <TransactionHistory 
                        walletAddress={walletAddress} 
                        key={historyRefreshKey} 
                        onBack={() => setShowHistory(false)}
                    />
                ) : (
                    <>
                        <RepoInput
                            onRepoSubmit={(url) => setRepo(url)}
                            loading={isAnyLoading}
                        />
                        {repo && (
                            <AnalysisDashboard
                                repo={repo}
                                analyses={analyses}
                                onAnalyze={handleAnalyze}
                                loading={loading}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default App;