import OpenAI from 'openai';
import { config } from '../utils/config.js';
import { logger } from '../utils/logger.js';

class AIService {
    constructor() {
        // Initialize OpenAI client with optional custom baseURL for AgentRouter / proxy providers
        const apiKey = config.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
        const baseURL = config.OPENAI_BASE_URL || process.env.OPENAI_BASE_URL || 'https://agentrouter.ai/v1';

        if (apiKey) {
            this.client = new OpenAI({
                apiKey: apiKey,
                baseURL: baseURL
            });
        }
        this.model = config.OPENAI_MODEL || process.env.OPENAI_MODEL || 'gpt-5.6-sol';
    }

    // MAIN AI CALL WITH DEMO MODE
    async callAI(prompt, model = null, maxRetries = 3) {
        // HACKATHON DEMO MODE: Return mock data instantly
        if (process.env.DEMO_MODE === 'true') {
            logger.info(' DEMO MODE: Returning mock data');
            return this.generateMockResponse(prompt);
        }

        if (!this.client) {
            throw new Error('AI Client is not initialized. Please set OPENAI_API_KEY in your environment variables.');
        }

        // REAL AI Call (AgentRouter or OpenAI)
        const modelToUse = model || this.model;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await this.client.chat.completions.create({
                    model: modelToUse,
                    messages: [
                        { role: 'system', content: 'You are a helpful AI assistant. Return valid JSON.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.3,
                    response_format: { type: 'json_object' }
                });
                return JSON.parse(response.choices[0].message.content);
            } catch (error) {
                logger.error(`AI call attempt ${attempt} failed:`, error.message);
                if (attempt === maxRetries) throw error;
                await new Promise(r => setTimeout(r, 1000 * attempt));
            }
        }
    }


    // MOCK DATA GENERATOR WITH IMPROVEMENT PLANS
    generateMockResponse(prompt) {
        // Security Audit
        if (prompt.includes('Security Audit')) {
            const score = Math.floor(Math.random() * 30) + 65;
            return {
                security_score: score,
                vulnerabilities: [
                    { severity: 'high', description: 'Outdated dependency detected', fix: 'Update to latest version', affected_file: 'package.json' },
                    { severity: 'medium', description: 'Potential XSS vulnerability', fix: 'Add input sanitization', affected_file: 'src/components/App.js' },
                    { severity: 'low', description: 'Missing rate limiting', fix: 'Implement express-rate-limit', affected_file: 'server.js' }
                ],
                best_practices_missing: ['Testing coverage < 80%', 'Missing CI/CD pipeline', 'No dependency scanning'],
                recommendations: ['Implement automated security scanning', 'Add Dependabot', 'Run npm audit regularly'],
                overall_risk_level: score > 80 ? 'low' : score > 60 ? 'medium' : 'high',
        
                improvement_plan: [
                    {
                        priority: 'critical',
                        title: 'Fix critical vulnerability',
                        description: `${score > 80 ? 'No critical issues found' : 'Update vulnerable packages'}`, 
                        action: score > 80 ? '✅ All good!' : 'Run: npm update --save',
                        estimated_time: score > 80 ? '0 hours' : '2 hours'
                    },
                    {
                        priority: 'high',
                        title: 'Improve test coverage',
                        description: 'Current coverage is below 80%',
                        action: 'Write unit tests for core components',
                        estimated_time: '4 hours'
                    },
                    {
                        priority: 'medium',
                        title: 'Add CI/CD pipeline',
                        description: 'No automated testing in CI',
                        action: 'Add GitHub Actions workflow',
                        estimated_time: '3 hours'
                    },
                    {
                        priority: 'low',
                        title: 'Update documentation',
                        description: 'API docs are outdated',
                        action: 'Generate API documentation with JSDoc',
                        estimated_time: '2 hours'
                    }
                ],
                total_improvement_time: '11 hours',
                auto_fix_available: true,
                auto_fix_summary: 'We can automatically update vulnerable packages and add a CI workflow'
            };
        }

        // Pitch Deck
        if (prompt.includes('Pitch Deck')) {
            return {
                problem_statement: 'Developers waste 4+ hours/week analyzing GitHub repos manually',
                solution: 'AI-powered intelligence for GitHub repositories with pay-per-call pricing',
                target_market: 'Developers, VCs, security teams, open-source maintainers',
                competition: ['Dependabot', 'Snyk', 'CodeQL', 'GitHub Copilot'],
                business_model: 'Pay-per-call micropayments via x402 on Algorand',
                traction: '50+ beta users, 200+ repos analyzed',
                team_assessment: 'Strong technical team with blockchain and AI expertise',
                investment_ask: '$500K seed round for team expansion',
                use_cases: ['Security auditing', 'Due diligence', 'Documentation generation', 'Investment analysis'],
              
                improvement_plan: [
                    {
                        priority: 'high',
                        title: 'Validate product-market fit',
                        description: 'Conduct user interviews with 20+ developers',
                        action: 'Create user feedback survey',
                        estimated_time: '5 hours'
                    },
                    {
                        priority: 'medium',
                        title: 'Refine pricing strategy',
                        description: 'Compare x402 pricing with competitors',
                        action: 'Analyze subscription vs pay-per-call models',
                        estimated_time: '3 hours'
                    },
                    {
                        priority: 'low',
                        title: 'Create investor pitch deck',
                        description: 'We can generate one for you!',
                        action: 'Click "Generate Pitch Deck" below',
                        estimated_time: '0 hours (instant)'
                    }
                ],
                total_improvement_time: '8 hours',
                auto_fix_available: true,
                auto_fix_summary: 'Pitch deck generation available'
            };
        }

        // Architecture
        if (prompt.includes('Architecture')) {
            return {
                mermaid_code: 'graph TD\n  A[React Frontend] --> B[Node.js API]\n  B --> C[OpenAI]\n  B --> D[GitHub API]\n  B --> E[Algorand x402]\n  E --> F[Payment Verification]',
                components: ['React Frontend', 'Node.js Backend', 'OpenAI Integration', 'GitHub API', 'Algorand Blockchain'],
                data_flow: 'User enters repo → Backend fetches data → AI analyzes → x402 payment verified → Results returned with receipt',
                tech_stack: { frontend: 'React', backend: 'Node.js', database: 'SQLite', blockchain: 'Algorand' },
                
                improvement_plan: [
                    {
                        priority: 'high',
                        title: 'Add caching layer',
                        description: 'Redis cache could speed up responses by 70%',
                        action: 'Implement Redis for API caching',
                        estimated_time: '4 hours'
                    },
                    {
                        priority: 'medium',
                        title: 'Add load balancing',
                        description: 'Prepare for 1000+ concurrent users',
                        action: 'Implement NGINX load balancer',
                        estimated_time: '3 hours'
                    },
                    {
                        priority: 'low',
                        title: 'Add monitoring',
                        description: 'Implement logging and monitoring',
                        action: 'Add Winston logger + Sentry',
                        estimated_time: '2 hours'
                    }
                ],
                total_improvement_time: '9 hours',
                auto_fix_available: false,
                auto_fix_summary: 'Architecture optimization plan ready'
            };
        }

        // Investor Score
        if (prompt.includes('Investor Score')) {
            const score = Math.floor(Math.random() * 30) + 65;
            return {
                overall_score: score,
                market_viability_score: Math.floor(Math.random() * 30) + 60,
                technical_soundness_score: Math.floor(Math.random() * 25) + 70,
                team_score: Math.floor(Math.random() * 20) + 70,
                traction_score: Math.floor(Math.random() * 30) + 50,
                risks: ['Competition from established players', 'Dependency on OpenAI'],
                strengths: ['Unique x402 integration', 'Strong technical team'],
                investor_readiness: score > 80 ? 'seed' : 'pre-seed',
                
                improvement_plan: [
                    {
                        priority: 'high',
                        title: 'Increase traction',
                        description: `Current traction score: ${Math.floor(Math.random() * 30) + 50}`,
                        action: 'Acquire 100+ beta users',
                        estimated_time: '2 weeks'
                    },
                    {
                        priority: 'medium',
                        title: 'Reduce dependency risk',
                        description: 'Reduce reliance on a single AI provider',
                        action: 'Add support for Claude and local LLMs',
                        estimated_time: '3 days'
                    },
                    {
                        priority: 'low',
                        title: 'Prepare investor materials',
                        description: 'We can generate a pitch deck for you!',
                        action: 'Click "Generate Pitch Deck"',
                        estimated_time: '0 hours (instant)'
                    }
                ],
                total_improvement_time: '2-4 weeks',
                auto_fix_available: false,
                auto_fix_summary: 'Focus on user acquisition and distribution'
            };
        }

        // README Rewrite
        if (prompt.includes('README Rewrite')) {
            return {
                rewritten_readme: '# Project Name\n\n## Overview\nThis project is a powerful tool for analyzing GitHub repositories using AI and blockchain technology.\n\n## Features\n- AI-powered security audits\n- Pitch deck generation\n- Architecture diagram generation\n\n## Installation\n```bash\nnpm install\n```\n\n## Usage\n```bash\nnpm start\n```\n\n## License\nMIT',
                improvements_made: ['Added installation guide', 'Improved clarity', 'Added features section'],
                sections_added: ['Overview', 'Features', 'Installation', 'Usage'],
                clarity_score: 85,
        
                improvement_plan: [
                    {
                        priority: 'high',
                        title: 'Add API documentation',
                        description: 'API endpoints need detailed documentation',
                        action: 'Generate JSDoc comments',
                        estimated_time: '3 hours'
                    },
                    {
                        priority: 'medium',
                        title: 'Add contributing guidelines',
                        description: 'No CONTRIBUTING.md found',
                        action: 'Create CONTRIBUTING.md template',
                        estimated_time: '1 hour'
                    },
                    {
                        priority: 'low',
                        title: 'Add code examples',
                        description: 'Add more usage examples',
                        action: 'Add demo snippets in README',
                        estimated_time: '1 hour'
                    }
                ],
                total_improvement_time: '5 hours',
                auto_fix_available: true,
                auto_fix_summary: 'We can generate CONTRIBUTING.md for you'
            };
        }

        // Dependency Audit
        if (prompt.includes('Dependency Audit')) {
            const total = Math.floor(Math.random() * 50) + 10;
            const vuln = Math.floor(Math.random() * 5);
            const score = Math.floor(Math.random() * 30) + 60;
            return {
                total_packages: total,
                outdated_packages: [
                    { name: 'express', current: '4.18.1', latest: '4.19.2', severity: 'medium' },
                    { name: 'react', current: '18.2.0', latest: '18.3.1', severity: 'low' }
                ],
                license_risks: [
                    { package: 'some-package', license: 'GPL-3.0', risk_level: 'medium' }
                ],
                vulnerability_count: vuln,
                security_score: score,
                recommendations: ['Update express to v4.19.2', 'Review GPL-3.0 license compatibility'],
               
                improvement_plan: [
                    {
                        priority: 'critical',
                        title: `Update ${vuln} vulnerable dependencies`,
                        description: `${vuln} packages have security issues`,
                        action: 'Run: npm audit fix --force',
                        estimated_time: '1 hour'
                    },
                    {
                        priority: 'medium',
                        title: 'Review license compatibility',
                        description: 'GPL license may conflict with commercial use',
                        action: 'Replace GPL packages with MIT/Apache alternatives',
                        estimated_time: '4 hours'
                    },
                    {
                        priority: 'low',
                        title: 'Implement dependabot',
                        description: 'Automate dependency updates',
                        action: 'Enable GitHub Dependabot',
                        estimated_time: '0 hours (auto)'
                    }
                ],
                total_improvement_time: '5 hours',
                auto_fix_available: true,
                auto_fix_summary: 'We can update package.json automatically'
            };
        }

        // Market Analysis
        if (prompt.includes('Market Analysis')) {
            return {
                tam: 1000000000,
                sam: 250000000,
                competitors: [
                    { name: 'Snyk', strengths: 'Established brand', weaknesses: 'Subscription-based' },
                    { name: 'Dependabot', strengths: 'GitHub integration', weaknesses: 'Limited features' }
                ],
                market_trends: ['AI-powered development tools growing 30% YoY', 'Blockchain for payments emerging'],
                target_customers: ['Startups', 'Enterprise', 'Open-source maintainers'],
                pricing_strategy: 'Pay-per-call with bulk discounts',
                go_to_market: 'Launch as GitHub App, API-first approach',
                
                improvement_plan: [
                    {
                        priority: 'high',
                        title: 'Target enterprise customers',
                        description: 'Enterprise market is 3x larger than startups',
                        action: 'Create enterprise sales deck',
                        estimated_time: '8 hours'
                    },
                    {
                        priority: 'medium',
                        title: 'Expand to other platforms',
                        description: 'GitLab and Bitbucket support needed',
                        action: 'Integrate with GitLab API',
                        estimated_time: '1 week'
                    },
                    {
                        priority: 'low',
                        title: 'Create case studies',
                        description: 'Case studies build trust with customers',
                        action: 'Create 3 case studies with beta users',
                        estimated_time: '2 hours'
                    }
                ],
                total_improvement_time: '1-2 weeks',
                auto_fix_available: false,
                auto_fix_summary: 'Market analysis complete'
            };
        }

        // Demo Script
        if (prompt.includes('Demo Script')) {
            return {
                script: '1. Introduction (30s): Show RepoPilot AI dashboard\n2. Enter GitHub repo (30s): Paste react repo\n3. Run analysis (30s): Click Security Audit\n4. x402 payment flow (60s): Show payment modal\n5. Results (30s): Display analysis with receipt',
                key_points: ['x402 micropayments', 'AI-powered insights', 'Transaction history'],
                audience_questions: ['How does x402 work?', 'What about privacy?', 'How is pricing determined?'],
                demo_flow: [
                    { step: 'Open dashboard', action: 'Show homepage', duration: '30s' },
                    { step: 'Enter repo', action: 'Paste GitHub URL', duration: '30s' },
                    { step: 'Run analysis', action: 'Click analyze button', duration: '30s' },
                    { step: 'Payment flow', action: 'Show x402 payment', duration: '60s' },
                    { step: 'Results', action: 'Show analysis with receipt', duration: '30s' }
                ],
                
                improvement_plan: [
                    {
                        priority: 'medium',
                        title: 'Record a video demo',
                        description: 'Video demo is more engaging',
                        action: 'Record 2-minute demo video',
                        estimated_time: '30 minutes'
                    },
                    {
                        priority: 'low',
                        title: 'Add demo data',
                        description: 'Pre-populate with example repos',
                        action: 'Add "Example Repos" dropdown',
                        estimated_time: '1 hour'
                    }
                ],
                total_improvement_time: '2 hours',
                auto_fix_available: false,
                auto_fix_summary: 'Demo script ready for recording'
            };
        }

        // Default fallback with improvement plan
        return {
            success: true,
            message: 'Analysis completed successfully',
            data: { score: 85, summary: 'Mock analysis for hackathon demo' },
            
            improvement_plan: [
                {
                    priority: 'medium',
                    title: 'Add more details to the analysis',
                    description: 'The analysis was brief',
                    action: 'Run a more comprehensive scan',
                    estimated_time: '2 hours'
                }
            ],
            total_improvement_time: '2 hours',
            auto_fix_available: false,
            auto_fix_summary: 'Analysis complete'
        };
    }

    // ENDPOINT METHODS
    async generatePitchDeck(repoData) {
        const prompt = `Generate a pitch deck for ${repoData.name}`;
        return await this.callAI(prompt);
    }

    async generateSecurityAudit(repoData) {
        const prompt = `Perform security audit for ${repoData.name}`;
        return await this.callAI(prompt);
    }

    async generateArchitecture(repoData) {
        const prompt = `Generate architecture for ${repoData.name}`;
        return await this.callAI(prompt);
    }

    async generateInvestorScore(repoData) {
        const prompt = `Generate investor score for ${repoData.name}`;
        return await this.callAI(prompt);
    }

    async rewriteReadme(repoData) {
        const prompt = `Rewrite README for ${repoData.name}`;
        return await this.callAI(prompt);
    }

    async generateDependencyAudit(repoData) {
        const prompt = `Audit dependencies for ${repoData.name}`;
        return await this.callAI(prompt);
    }

    async generateMarketAnalysis(repoData) {
        const prompt = `Analyze market for ${repoData.name}`;
        return await this.callAI(prompt);
    }

    async generateDemoScript(repoData) {
        const prompt = `Generate demo script for ${repoData.name}`;
        return await this.callAI(prompt);
    }
}

export const aiService = new AIService();