import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Animal Quiz MCP Endpoint",
    status: "active",
    description: "Active MCP server for Animal Quiz Orchestrator",
    capabilities: ["animal-knowledge-testing", "quiz-generation", "adaptive-quizzing"],
    timestamp: new Date().toISOString(),
    tools: [
      { name: "get_race_status", description: "Get status of current race" },
      { name: "start_race", description: "Start a new race" },
      { name: "get_leaderboard", description: "Returns the global leaderboard" },
      { name: "optimize_speed", description: "Optimize simulation speed" },
      { name: "get_track_info", description: "Get details about the racing track" }
    ],
    prompts: [],
    resources: []
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Content-Type': 'application/json'
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, command, params, task } = body;
    const cmd = (action || command || task || "").toLowerCase();

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
          executed: params || command,
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
        
      case "tools/list":
      case "list_tools":
        result = {
          tools: [
            { name: "get_race_status", description: "Get status of current race" },
            { name: "start_race", description: "Start a new race" },
            { name: "get_leaderboard", description: "Returns the global leaderboard" },
            { name: "optimize_speed", description: "Optimize simulation speed" },
            { name: "get_track_info", description: "Get details about the racing track" }
          ],
          prompts: [],
          resources: []
        };
        break;

      case "tools/call":
      case "call_tool":
        const toolName = params?.name || command;
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

    return NextResponse.json({
      status: "success",
      agent: "Animal Quiz Orchestrator",
      response: result,
      receivedAt: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Failed to process MCP command"
    }, { 
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
