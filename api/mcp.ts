export const config = {
  runtime: 'edge',
};

const mcpTools = [
  {
    name: "get_quiz_status",
    description: "Get status of current quiz",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "start_quiz",
    description: "Start a new animal quiz",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "get_leaderboard",
    description: "Returns the global leaderboard",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "submit_answer",
    description: "Submit an answer to a question",
    inputSchema: {
      type: "object",
      properties: {
        answer: { type: "string", description: "The answer to submit" }
      },
      required: ["answer"]
    }
  },
  {
    name: "get_animal_fact",
    description: "Get a random animal fact",
    inputSchema: { type: "object", properties: {} }
  }
];

export default async function handler(req: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify({
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
      tools: mcpTools,
      prompts: [],
      resources: []
    }), { headers: corsHeaders });
  }

  if (req.method === 'POST') {
    try {
      const body = await req.json();
      
      // Standard JSON-RPC MCP Support
      if (body.method === 'tools/list') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: body.id,
          result: {
            tools: mcpTools
          }
        }), { headers: corsHeaders });
      }
      
      if (body.method === 'prompts/list') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: body.id,
          result: { prompts: [] }
        }), { headers: corsHeaders });
      }

      if (body.method === 'resources/list') {
        return new Response(JSON.stringify({
          jsonrpc: "2.0",
          id: body.id,
          result: { resources: [] }
        }), { headers: corsHeaders });
      }

      const action = body.action || body.command || body.task || body.method || "";
      const cmd = action.toLowerCase();

      // Legacy / Custom webhook support
      if (cmd === "tools/list" || cmd === "list_tools") {
        return new Response(JSON.stringify({
          tools: mcpTools,
          prompts: [],
          resources: []
        }), { headers: corsHeaders });
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

      return new Response(JSON.stringify({
        status: "success",
        agent: "Animal Quiz Orchestrator",
        response: result,
        tools: mcpTools,
        prompts: [],
        resources: [],
        receivedAt: new Date().toISOString()
      }), { headers: corsHeaders });

    } catch (error) {
      return new Response(JSON.stringify({
        status: "error",
        message: "Failed to process MCP command"
      }), { status: 400, headers: corsHeaders });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
}
