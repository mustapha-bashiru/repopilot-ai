#  RepoPilot AI

**Intelligence-as-a-Service for GitHub Repositories**

[![x402](https://img.shields.io/badge/x402-Payment%20Required-blue)](https://x402.org)
[![Algorand](https://img.shields.io/badge/Algorand-Blockchain-green)](https://algorand.com)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-purple)](https://openai.com)
[![Brainwave](https://img.shields.io/badge/Brainwave-2026-orange)](https://brainwave.com)



##  The Problem

Developers, VCs, and security teams spend **4+ hours per week** analyzing GitHub repositories:
-  Understanding architecture
-  Identifying security risks
-  Evaluating investment potential
-  Writing documentation
-  Creating pitch decks


##  The Solution

**RepoPilot AI** turns GitHub repositories into actionable intelligence with **8 AI-powered analyses**, each available via **x402 micropayments** on Algorand.

###  Features

| Feature | Price | Description |
|---------|-------|-------------|
|  Pitch Deck | 0.02 ALGO | Generate investor-ready pitch deck |
|  Security Audit | 0.03 ALGO | Identify vulnerabilities + fixes |
|  Architecture | 0.02 ALGO | Mermaid diagram + component breakdown |
|  Investor Score | 0.01 ALGO | Startup readiness score (0-100) |
|  README Rewrite | 0.01 ALGO | Professional README rewrite |
|  Dependency Audit | 0.02 ALGO | License risks + vulnerability scan |
|  Market Analysis | 0.04 ALGO | TAM, SAM, competitors, pricing |
|  Demo Script | 0.01 ALGO | 5-minute investor demo script |

**Total to fully analyze a repo: 0.16 ALGO (~$0.08)**



##  Why x402?

- **Pay-per-call, not subscription** → You only pay for what you use
- **AI agents can pay autonomously** → No accounts, no checkouts
- **Micro-payments are viable** → Algorand's sub-cent fees
- **Receipts for every transaction** → Transparent and auditable



##  The x402 Flow

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶   x402       ────▶   Algorand   │
│  (React)    │     │  Middleware │     │  (Payment)  │
└─────────────┘     └─────────────┘     └─────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │  GitHub API │
                    └─────────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │  OpenAI     │
                    │  GPT-4      │
                    └─────────────┘


### Step-by-Step:

1. **Client requests analysis** → HTTP request to API
2. **Server responds with 402** → Payment requirements returned
3. **Client pays via Algorand** → Transaction sent to merchant
4. **Server verifies and settles** → Payment confirmed on-chain
5. **Resource returned** → Analysis results with receipt



##  Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | Node.js + Express |
| Blockchain | Algorand (x402 standard) |
| AI | OpenAI API (GPT-4) |
| Database | SQLite |
| Deployment | Docker + Vercel/Railway |


##  Quick Start

### Prerequisites
- Node.js 18+
- Algorand wallet (Pera/MyAlgo)
- OpenAI API key
- GitHub personal access token

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/repopilot-ai.git
cd repopilot-ai

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# Frontend setup
cd ../frontend
npm install

# Algorand Configuration
ALGOD_SERVER=https://testnet-api.algorand.network
ALGOD_PORT=443
MERCHANT_ADDRESS=your_algorand_address
MERCHANT_PRIVATE_KEY=your_private_key

# x402 Facilitator
X402_FACILITATOR_URL=https://x402.plausible.io
X402_API_KEY=your_x402_api_key

# AI Provider
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key

# GitHub
GITHUB_TOKEN=your_github_personal_access_token

# Database
DATABASE_URL=./data/repopilot.db

# Server
PORT=3001
NODE_ENV=development


# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start


# Access the App
Frontend: http://localhost:3000

Backend: http://localhost:3001


# Get Repository Overview (Free for testing)
curl -X POST http://localhost:3001/api/repos/overview \
  -H "Content-Type: application/json" \
  -d '{"repo": "https://github.com/facebook/react"}'



# x402 payment required
  # Step 1: Request analysis
curl -X POST http://localhost:3001/api/pitch-deck \
  -H "Content-Type: application/json" \
  -d '{"repo": "https://github.com/facebook/react"}'

# Step 2: 402 Payment Required response
# Step 3: Pay via Algorand
# Step 4: Retry with receipt
curl -X POST http://localhost:3001/api/pitch-deck \
  -H "Content-Type: application/json" \
  -H "X-Payment-Receipt: {\"txid\":\"...\",\"reference\":\"...\"}" \
  -d '{"repo": "https://github.com/facebook/react"}'


  # Available Endpoints
Endpoint	| Price |	Description
/pitch-deck |	0.02 | ALGO	Pitch deck generation
/security-audit	| 0.03 | ALGO	Security vulnerability scan
/architecture	| 0.02 | ALGO	Architecture diagram
/investor-score	| 0.01|  ALGO	Investment readiness score
/readme-rewrite	| 0.01 | ALGO	Professional README
/dependency-audit	|0.02 | ALGO	Dependency scan
/market-analysis | 0.04 | ALGO	Market analysis
/demo-script	| 0.01 | ALGO	Demo script generation


##m Screenshots
Dashboard
https://Dashboard.png

Analysis Modal
https://Analysis.png

Transaction History
https://transaction-dashboard.png


-- Brainwave 2026
Built for the x402 Blockchain Track at Brainwave 2026.

-- Team: Mustech

-- Contact: mustaphabashiru442@gmail.com


-- License
MIT

-- Acknowledgments
GoPlausible - x402 Facilitator

Algorand Foundation - Blockchain Infrastructure

OpenAI - GPT-4 API