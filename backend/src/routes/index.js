import express from 'express';
import { githubService } from '../services/github.js';
import { aiService } from '../services/ai.js';
import { ReceiptModel } from '../models/Receipt.js';
import { logger } from '../utils/logger.js';

export const createRoutes = () => {
    const router = express.Router();

    // Helper function to extract repo URL from any common request key
    const getRepoUrl = (req) => {
        const url = req.body?.repo || req.body?.repoUrl || req.body?.url || req.query?.repo || req.query?.url;
        if (!url || typeof url !== 'string') {
            return null;
        }
        return url.trim();
    };

    // Helper function to handle all analysis requests
    const createAnalysisHandler = (featureName, aiMethod) => {
        return async (req, res) => {
            try {
                const repo = getRepoUrl(req);
                if (!repo) {
                    return res.status(400).json({ error: 'Repository URL required' });
                }

                logger.info(`Fetching repo data for ${repo}`);
                const repoData = await githubService.fetchRepoData(repo);

                logger.info(`Generating ${featureName}...`);
                const result = await aiService[aiMethod](repoData);

                res.json({
                    data: result,
                    feature: featureName,
                    repo: repoData.fullName || repo,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                logger.error(`Error in ${featureName}:`, error.message);

                // Return 400 for client URL/GitHub issues, 500 for backend crashes
                const status = error.message.includes('Invalid URL') || error.message.includes('404') ? 400 : 500;
                res.status(status).json({ error: error.message });
            }
        };
    };

    // All 8 endpoints
    router.post('/pitch-deck', createAnalysisHandler('Pitch Deck', 'generatePitchDeck'));
    router.post('/security-audit', createAnalysisHandler('Security Audit', 'generateSecurityAudit'));
    router.post('/architecture', createAnalysisHandler('Architecture', 'generateArchitecture'));
    router.post('/investor-score', createAnalysisHandler('Investor Score', 'generateInvestorScore'));
    router.post('/readme-rewrite', createAnalysisHandler('README Rewrite', 'rewriteReadme'));
    router.post('/dependency-audit', createAnalysisHandler('Dependency Audit', 'generateDependencyAudit'));
    router.post('/market-analysis', createAnalysisHandler('Market Analysis', 'generateMarketAnalysis'));
    router.post('/demo-script', createAnalysisHandler('Demo Script', 'generateDemoScript'));

    // Free endpoint - get repo overview (no payment required)
    router.post('/repos/overview', async (req, res) => {
        try {
            const repo = getRepoUrl(req);
            if (!repo) {
                return res.status(400).json({ error: 'Repository URL required' });
            }

            const repoData = await githubService.fetchRepoData(repo);
            res.json({
                name: repoData.name,
                fullName: repoData.fullName,
                description: repoData.description,
                stars: repoData.stars,
                forks: repoData.forks,
                language: repoData.language,
                available_analyses: [
                    { name: 'Pitch Deck', endpoint: '/pitch-deck', price: 0.02 },
                    { name: 'Security Audit', endpoint: '/security-audit', price: 0.03 },
                    { name: 'Architecture', endpoint: '/architecture', price: 0.02 },
                    { name: 'Investor Score', endpoint: '/investor-score', price: 0.01 },
                    { name: 'README Rewrite', endpoint: '/readme-rewrite', price: 0.01 },
                    { name: 'Dependency Audit', endpoint: '/dependency-audit', price: 0.02 },
                    { name: 'Market Analysis', endpoint: '/market-analysis', price: 0.04 },
                    { name: 'Demo Script', endpoint: '/demo-script', price: 0.01 }
                ]
            });
        } catch (error) {
            logger.error('Repo overview error:', error.message);
            const status = error.message.includes('Invalid URL') || error.message.includes('404') ? 400 : 500;
            res.status(status).json({ error: error.message });
        }
    });

    // Transaction history endpoint
    router.get('/transactions', async (req, res) => {
        try {
            const stats = await ReceiptModel.getStats();
            const transactions = await ReceiptModel.getAll();
            res.json({
                total: stats.total || 0,
                totalRevenue: stats.totalRevenue || 0,
                avgAmount: stats.avgAmount || 0,
                transactions: transactions
            });
        } catch (error) {
            logger.error('Transactions error:', error.message);
            res.status(500).json({ error: error.message });
        }
    });

    router.get('/history/:walletAddress', async (req, res) => {
        try {
            const history = await ReceiptModel.findAll({
                where: { sender: req.params.walletAddress },
                order: [['createdAt', 'DESC']]
            });
            res.json({ success: true, history });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch history' });
        }
    });

    return router;
};