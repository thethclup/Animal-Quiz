import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: "Animal Quiz Orchestrator",
    description: "Wildlife knowledge and interactive quiz master",
    status: "active",
    platform: "Animal Quiz",
    version: "1.0.0",
    type: "ERC-8004 Agent",
    lastUpdated: new Date().toISOString()
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      status: "success",
      message: "Agent processed request",
      received: true
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return NextResponse.json({ status: "error" }, { status: 400 });
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
