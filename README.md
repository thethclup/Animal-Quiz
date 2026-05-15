# Animal Quiz

Animal Quiz is a fun, beautiful, and educational animal trivia game. Test and improve your knowledge of the animal kingdom with fast-paced, visually stunning questions.

## Features

- **Mobile First Design**: Quick-tap trivia format optimized for touch screens.
- **Multiple Game Modes**: Classic, Blitz, Endless, Daily Challenges.
- **On-Chain Architecture**: 
  - On-chain High Scores and Longest Streaks using SIWE signatures.
  - ERC-8021 Transaction Attribution
  - ERC-8004 Trustless Agents Integration
  - "Say GM" simple on-chain transaction button
- **Educational Elements**: Detailed "Did You Know?" fun facts on answer interactions.
- **Agent Integrations**: Built-in endpoints for A2A communication (`/api/agent`) and MCP workflows (`/api/mcp`).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server (includes Vite SPA and API endpoints):
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Start production server:
```bash
npm run start
```

## Smart Contract Integration
Animal Quiz connects predominantly to **Base Mainnet**. Wagmi/Viem handles transactions, wallet signatures, and integration hooks. The orchestrator is configured for safe trustless interactions using the ERC-8004 agent standard.

*Note: Sensitive configuration values (like API keys) should be stored in your `.env` file based on `.env.example`.*
