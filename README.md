# Animal Quiz / Orchestrator

Animal Quiz is an educational animal trivia setup and AI Orchestrator providing high-performance capabilities. It connects testing wildlife knowledge with real-time optimization, orchestration logic, and adaptive game loops.

## Features

- **Multi-Question Orchestration**: Evaluate answers, verify facts, and string together sessions dynamically.
- **Animal Knowledge Testing**: Validate wildlife facts interactively.
- **Adaptive Quizzing**: Responsive design to challenge the player properly.
- **Educational Value**: Build knowledge via engaging data.
- **A2A / ERC-8004 Architecture**: Fully compliant Trustless Agent layout capable of connecting with external orchestrators via well-known schemas.
- **MCP Endpoint**: Readout tools, resources, and endpoints automatically.

## AI Agent & Model Context Protocol (MCP)

This project fully supports MCP integration. By hooking into `/api/mcp`, downstream services or Agentic frameworks can execute various tasks on the system.

### Exploring the Built-in Tools

Currently, the orchestration environment exposes the following tool proxies for external clients via the standard MCP HTTP endpoint format (Next.js App Router API):

- `get_quiz_status`
- `start_quiz`
- `get_leaderboard`
- `submit_answer`
- `get_animal_fact`

Send a `POST` to `/api/mcp` with `{ "action": "tools/list" }` or `{ "jsonrpc": "2.0", "method": "tools/list" }` to interface directly with the agent orchestration.

## Setup & Local Development

This application features modern React tooling natively.

1. **Install dependencies**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Build and Serve for Production**:
```bash
npm run build
npm run start
```

## Agent Registration Info

The Agent card is automatically hosted at `/.well-known/agent-card.json`.
It exposes standard definitions under `eip155:8453` and enables A2A (Agent-to-Agent) discovery, making it plug-and-play for Base/Agent integrations.
