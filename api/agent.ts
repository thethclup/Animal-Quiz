export const config = {
  runtime: 'edge',
};

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
      name: "Animal Quiz Orchestrator",
      description: "Wildlife knowledge and interactive quiz master",
      status: "active",
      platform: "Animal Quiz",
      version: "1.0.0",
      type: "ERC-8004 Agent",
      lastUpdated: new Date().toISOString()
    }), { headers: corsHeaders });
  }

  if (req.method === 'POST') {
    return new Response(JSON.stringify({
      status: "success",
      message: "Agent processed request",
      received: true
    }), { headers: corsHeaders });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
}
