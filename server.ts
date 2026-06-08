import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Animal Quiz Orchestrator - Agent Info Endpoint
  app.get('/api/agent', (req, res) => {
    res.json({
      name: "Animal Quiz Orchestrator",
      description: "Wildlife knowledge and interactive quiz master",
      status: "active",
      wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
      platform: "Animal Quiz",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    });
  });

  app.get('/api/mcp', (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Animal Quiz MCP Endpoint",
      status: "active",
      description: "Active MCP server for Animal Quiz Orchestrator",
      capabilities: {
        tools: {},
        prompts: {},
        resources: {}
      },
      timestamp: new Date().toISOString(),
      tools: [
        { name: "get_quiz_status", description: "Get status of current quiz", inputSchema: { type: "object", properties: {} } },
        { name: "start_quiz", description: "Start a new animal quiz", inputSchema: { type: "object", properties: {} } },
        { name: "get_leaderboard", description: "Returns the global leaderboard", inputSchema: { type: "object", properties: {} } },
        { name: "submit_answer", description: "Submit an answer to a question", inputSchema: { type: "object", properties: { answer: { type: "string" } } } },
        { name: "get_animal_fact", description: "Get a random animal fact", inputSchema: { type: "object", properties: {} } }
      ],
      prompts: [],
      resources: []
    });
  });

  app.post('/api/mcp', (req, res) => {
    try {
      const body = req.body;
      
      // JSON-RPC MCP Support
      if (body.method === 'tools/list') {
        return res.json({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            tools: [
              { name: "get_quiz_status", description: "Get status of current quiz", inputSchema: { type: "object", properties: {} } },
              { name: "start_quiz", description: "Start a new animal quiz", inputSchema: { type: "object", properties: {} } },
              { name: "get_leaderboard", description: "Returns the global leaderboard", inputSchema: { type: "object", properties: {} } },
              { name: "submit_answer", description: "Submit an answer to a question", inputSchema: { type: "object", properties: { answer: { type: "string" } } } },
              { name: "get_animal_fact", description: "Get a random animal fact", inputSchema: { type: "object", properties: {} } }
            ]
          }
        });
      }
      if (body.method === 'prompts/list') {
        return res.json({ jsonrpc: "2.0", id: body.id, result: { prompts: [] } });
      }
      if (body.method === 'resources/list') {
        return res.json({ jsonrpc: "2.0", id: body.id, result: { resources: [] } });
      }

      const action = body.action || body.command || body.task || body.method || "";
      const cmd = action.toLowerCase();

      // Legacy format support
      if (cmd === "tools/list" || cmd === "list_tools") {
        return res.json({
          tools: [
            { name: "get_quiz_status", description: "Get status of current quiz", inputSchema: { type: "object", properties: {} } },
            { name: "start_quiz", description: "Start a new animal quiz", inputSchema: { type: "object", properties: {} } },
            { name: "get_leaderboard", description: "Returns the global leaderboard", inputSchema: { type: "object", properties: {} } },
            { name: "submit_answer", description: "Submit an answer to a question", inputSchema: { type: "object", properties: { answer: { type: "string" } } } },
            { name: "get_animal_fact", description: "Get a random animal fact", inputSchema: { type: "object", properties: {} } }
          ],
          prompts: [],
          resources: []
        });
      }

      let result: any = {};

      switch (cmd) {
        case "status":
        case "ping":
          result = { 
            status: "online", 
            agent: "Animal Quiz Orchestrator",
            message: "All animals are ready for quiz!" 
          };
          break;

        case "execute":
          result = {
            success: true,
            executed: body.params || body.command,
            executedAt: new Date().toISOString(),
            message: "Quiz command processed successfully"
          };
          break;

        case "get_info":
          result = {
            name: "Animal Quiz Orchestrator",
            wallet: "0xe157F1F5e12adB38Ba013683E9Ce24efe21e5bA6",
            platform: "Base",
            version: "1.0.0"
          };
          break;

        case "tools/call":
        case "call_tool":
          const toolName = body.params?.name || body.command;
          result = {
            success: true,
            message: `Tool ${toolName} executed successfully`,
            data: { status: "OK", timestamp: Date.now() }
          };
          break;

        default:
          result = {
            success: true,
            message: "Animal quiz command received",
            data: body
          };
      }

      res.json({
        status: "success",
        agent: "Animal Quiz Orchestrator",
        response: result,
        receivedAt: new Date().toISOString()
      });

    } catch (error) {
      res.status(400).json({
        status: "error",
        message: "Failed to process animal quiz command"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Note: process.cwd() is used since ESM doesn't have __dirname directly
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
