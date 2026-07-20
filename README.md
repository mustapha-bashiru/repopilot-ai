#  RepoPilot AI

## Pay-per-analysis intelligence for GitHub repositories

RepoPilot AI transforms GitHub repositories into actionable intelligence using AI-powered analysis modules that can be purchased individually through **x402 micropayments on the Algorand blockchain**.

Instead of subscriptions, accounts, or expensive software licenses; users and even autonomous AI agents can pay for exactly the analysis they need, one request at a time.


##  The Problem

Understanding a GitHub repository can take hours.

Developers, investors, security teams, and technical evaluators often need to:

* Understand an unfamiliar codebase
* Analyze software architecture
* Identify potential security vulnerabilities
* Review dependencies and license risks
* Evaluate a startup's technical readiness
* Understand the market surrounding a project
* Rewrite outdated documentation
* Prepare investor presentations and product demos

This information is valuable, but traditional tools often require subscriptions, expensive plans, or manual research.


##  The Solution

**RepoPilot AI turns a GitHub repository into actionable intelligence on demand.**

Users select the type of analysis they need, pay a small amount through an **x402-powered Algorand micropayment**, and receive an AI-generated result.

### The core idea:

> **One repository. Multiple intelligence modules. Pay only for the analysis you use.**


##  Intelligence Modules

| Module                    |     Price | Description                                                       |
| ------------------------- | --------: | ----------------------------------------------------------------- |
| 📊 Pitch Deck             | 0.02 ALGO | Generate an investor-ready pitch deck outline                     |
| 🛡️ Security Audit        | 0.03 ALGO | Identify potential security risks and recommended fixes           |
| 🏗️ Architecture Analysis | 0.02 ALGO | Generate architecture insights and Mermaid diagrams               |
| 📈 Investor Score         | 0.01 ALGO | Evaluate startup and project readiness on a 0–100 scale           |
| 📝 README Rewrite         | 0.01 ALGO | Transform existing documentation into professional README content |
| 📦 Dependency Audit       | 0.02 ALGO | Analyze dependencies, licensing concerns, and potential risks     |
| 🌍 Market Analysis        | 0.04 ALGO | Analyze market opportunities, competitors, and positioning        |
| 🎤 Demo Script            | 0.01 ALGO | Generate a structured script for a five-minute product demo       |

### Full Repository Intelligence

**Total cost for all eight analyses: 0.16 ALGO (depending on the price of ALGO at the current moment)**

Users only pay for the modules they need.


##  Why x402?

RepoPilot AI is designed around the idea that AI intelligence should be available as a **pay-per-request service**.

### No subscription required

Users do not need to commit to a monthly plan.

### Pay only for what you use

Each analysis is an independent paid request.

### AI agents can pay autonomously

The x402 model makes it possible for software agents to access paid intelligence APIs without traditional account-based checkout flows.

### Micropayments become practical

Algorand provides fast, low-cost blockchain transactions suitable for small-value API payments.

### Transparent payment records

Each paid analysis can be associated with an on-chain transaction, creating a transparent and auditable payment trail.


##  How It Works

```text
┌─────────────┐
│   Client    │
│ React + TS  │
└──────┬──────┘
       │
       │ 1. Request analysis
       ▼
┌────────────────────┐
│   RepoPilot API    │
│   x402 Middleware  │
└──────┬─────────────┘
       │
       │ 2. Payment Required
       ▼
┌────────────────────┐
│  Algorand Wallet   │
│  Sign Micropayment │
└──────┬─────────────┘
       │
       │ 3. Payment
       ▼
┌────────────────────┐
│     Algorand       │
│ Payment Settlement │
└──────┬─────────────┘
       │
       │ 4. Payment Verified
       ▼
┌────────────────────┐
│   RepoPilot API    │
│  Analysis Gateway  │
└──────┬─────────────┘
       │
       ├──────────────▶ GitHub API
       │                     │
       │                     ▼
       │              Repository Data
       │
       ▼
┌────────────────────┐
│      OpenAI        │
│   AI Analysis      │
└──────────┬─────────┘
           │
           ▼
   Intelligence Result
           │
           ▼
      React Client
```

### Request Flow

1. The client requests a paid repository analysis.
2. The API responds with an **HTTP 402 Payment Required** response.
3. The client creates and signs the required Algorand payment.
4. The payment is verified and settled through the x402 payment flow.
5. RepoPilot retrieves the relevant repository information from GitHub.
6. The AI model analyzes the repository data.
7. The requested intelligence is returned to the client.
8. The payment transaction provides a transparent on-chain receipt.


##  Example Use Cases

###  Developers

Quickly understand unfamiliar repositories and identify architecture or dependency issues.

###  Security Teams

Get an initial AI-assisted security analysis of a codebase.

###  Investors and VCs

Evaluate the technical maturity, market opportunity, and investment readiness of projects.

###  Startup Founders

Generate pitch materials, market analysis, documentation, and demo scripts from an existing repository.

###  Autonomous AI Agents

Access repository intelligence as a paid API without requiring a traditional subscription account.


##  Architecture

RepoPilot AI is built as a modular AI-powered API platform.

```text
┌──────────────────────────────────────────┐
│              React Frontend              │
│          Repository Intelligence UI      │
└─────────────────────┬────────────────────┘
                      │
                      ▼
┌──────────────────────────────────────────┐
│             Node.js + Express            │
│              RepoPilot API               │
└──────────┬───────────┬───────────┬───────┘
           │           │           │
           ▼           ▼           ▼
      x402 Layer   GitHub API   SQLite
           │
           ▼
      Algorand
   Payment Network
           │
           ▼
        OpenAI
      AI Analysis
```


##  Technology Stack

| Layer           | Technology                |
| --------------- | ------------------------- |
| Frontend        | React + TypeScript        |
| Backend         | Node.js + Express         |
| Payments        | x402                      |
| Blockchain      | Algorand                  |
| AI              | OpenAI API                |
| Repository Data | GitHub API                |
| Database        | SQLite                    |
| Deployment      | Docker + Vercel / Railway |

---

##  Quick Start

### Prerequisites

Before running RepoPilot AI locally, make sure you have:

* Node.js 18+
* An Algorand-compatible wallet
* An OpenAI API key
* A GitHub Personal Access Token
* An x402 facilitator configuration


### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/repopilot-ai.git
cd repopilot-ai
```

---

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Configure the required environment variables.

---

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

##  Environment Variables

Example configuration:

```env
# Algorand
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_PORT=443
MERCHANT_ADDRESS=your_algorand_address

# x402
X402_FACILITATOR_URL=your_facilitator_url
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
```

> ⚠️ Never commit API keys, private keys, wallet secrets, or `.env` files to version control.


##  Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

### Start the Frontend

In a separate terminal:

```bash
cd frontend
npm start
```

The application will be available at:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:3001
```

---

##  API Examples

### Free Repository Overview

A basic repository overview can be requested for testing:

```bash
curl -X POST http://localhost:3001/api/repos/overview \
  -H "Content-Type: application/json" \
  -d '{"repo":"https://github.com/facebook/react"}'
```


### Paid Analysis Request

Request a pitch deck analysis:

```bash
curl -X POST http://localhost:3001/api/pitch-deck \
  -H "Content-Type: application/json" \
  -d '{"repo":"https://github.com/facebook/react"}'
```

If payment is required, the API returns an HTTP `402 Payment Required` response containing the required payment information.

The client then completes the x402 payment flow and retries the request with the appropriate payment authorization.


##  Available API Endpoints

| Endpoint                |     Price | Description                                |
| ----------------------- | --------: | ------------------------------------------ |
| `/api/pitch-deck`       | 0.02 ALGO | Generate investor pitch intelligence       |
| `/api/security-audit`   | 0.03 ALGO | Analyze potential security risks           |
| `/api/architecture`     | 0.02 ALGO | Analyze architecture and generate diagrams |
| `/api/investor-score`   | 0.01 ALGO | Generate an investment readiness score     |
| `/api/readme-rewrite`   | 0.01 ALGO | Rewrite repository documentation           |
| `/api/dependency-audit` | 0.02 ALGO | Analyze dependencies and license risks     |
| `/api/market-analysis`  | 0.04 ALGO | Analyze market opportunity and competition |
| `/api/demo-script`      | 0.01 ALGO | Generate a structured product demo script  |


##  Security Considerations

RepoPilot AI is designed with the following principles:

* API keys are stored server-side.
* Private credentials should never be exposed to the frontend.
* Payment verification occurs before paid analysis is executed.
* GitHub access is handled through server-side API requests.
* Payment activity can be tracked through blockchain transactions.
* Environment variables are used for sensitive configuration.


##  Future Roadmap

Potential future improvements include:

* [ ] Support for additional AI providers
* [ ] Multi-chain payment support
* [ ] More repository intelligence modules
* [ ] Automated pull request analysis
* [ ] Continuous repository monitoring
* [ ] AI agent-native API access
* [ ] Team workspaces
* [ ] Repository comparison
* [ ] Historical analysis and trend tracking
* [ ] Public intelligence marketplace


##  Screenshots

### Dashboard

(https://Dashboard.png)

### Analysis Modal

(https://Analysis.png)

### Transaction History

(https://transaction-dashboard.png)


## Built for Brainwave 2026

RepoPilot AI was built for the **x402 Blockchain Track at Brainwave 2026**.

The project explores how blockchain-native micropayments can transform AI-powered APIs from subscription-based products into modular, pay-per-use intelligence services.


##  Team

**Mustech**

Built by **Bashiru Mustapha**


##  Acknowledgments

* **GoPlausible** — x402 facilitator infrastructure
* **Algorand Foundation** — Blockchain infrastructure
* **OpenAI** — AI model infrastructure


##  License

This project is licensed under the MIT License.


> **RepoPilot AI — Turn any GitHub repository into actionable intelligence, one paid analysis at a time.**
