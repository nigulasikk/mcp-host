import { createMcpServer } from '@/server/mcp-server';
import { QianwenProvider } from '@/server/model-provider';
import { NextRequest, NextResponse } from 'next/server';

let mcpServer: any = null;

export async function GET(request: NextRequest) {
  if (!mcpServer) {
    mcpServer = createMcpServer();
    
    await mcpServer.start({
      transportType: "sse",
      sse: {
        endpoint: "/api/mcp",
        port: parseInt(process.env.PORT || '3000')
      }
    });
  }
  
  const headers = new Headers();
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache, no-transform');
  headers.set('Connection', 'keep-alive');
  
  const response = new NextResponse(new ReadableStream({
    start(controller) {
    }
  }), {
    headers
  });
  
  return response;
}
