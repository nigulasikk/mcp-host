"use client";

import { useState, useEffect, useRef } from 'react';
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

export default function Home() {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'assistant', content: string}>>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const clientRef = useRef<any>(null);
  const transportRef = useRef<any>(null);
  
  useEffect(() => {
    async function initClient() {
      try {
        const client = new Client(
          {
            name: "mcp-nextjs-demo-client",
            version: "1.0.0",
          },
          {
            capabilities: {},
          }
        );
        clientRef.current = client;
        
        const transport = new SSEClientTransport(new URL(`${window.location.origin}/api/mcp`));
        transportRef.current = transport;
        
        await client.connect(transport);
        setIsConnected(true);
        
        const tools = await client.listTools();
        console.log("可用工具:", tools);
      } catch (error) {
        console.error("连接 MCP 服务器失败:", error);
      }
    }
    
    initClient();
    
    return () => {
      if (clientRef.current) {
        clientRef.current.close();
      }
    };
  }, []);
  
  const sendMessage = async () => {
    if (!input.trim() || !isConnected || isLoading) return;
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      if (userMessage.toLowerCase().includes('天气') || userMessage.toLowerCase().includes('weather')) {
        const location = userMessage.replace(/.*天气.*[:：]?\s*/, '').replace(/.*weather.*[:：]?\s*/, '').trim() || '北京';
        
        const result = await clientRef.current.callTool("getWeather", {
          location,
          units: "metric"
        });
        
        setMessages(prev => [...prev, { type: 'assistant', content: `正在获取${location}的天气信息...` }]);
        
        if (result.status === 'pending') {
          setTimeout(() => {
            setMessages(prev => [...prev, { type: 'assistant', content: result.data || '无法获取天气信息。' }]);
          }, 1000);
        } else {
          setMessages(prev => [...prev, { type: 'assistant', content: result.data || '无法获取天气信息。' }]);
        }
      } else {
        setMessages(prev => [...prev, { type: 'assistant', content: '我是一个简单的 MCP 演示 AI。请尝试询问我天气，例如："查询北京天气"' }]);
      }
    } catch (error) {
      console.error("调用工具失败:", error);
      setMessages(prev => [...prev, { type: 'assistant', content: '抱歉，发生了错误。' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-2xl font-bold mb-8 text-center">MCP 演示 - 使用 Next.js + FastMCP</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6 h-96 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg ${
                msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-500">
              <div className="inline-block p-3">思考中...</div>
            </div>
          )}
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入消息，例如：查询北京天气"
            disabled={!isConnected || isLoading}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected || isLoading}
          >
            发送
          </button>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-500">
          {isConnected ? '已连接到 MCP 服务器' : '正在连接 MCP 服务器...'}
        </div>
        
        <div className="mt-8 text-sm text-gray-600">
          <h2 className="font-bold mb-2">MCP 调用链路示例:</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>用户输入查询天气的请求</li>
            <li>前端通过 SSE 连接发送到 MCP 服务器</li>
            <li>MCP 服务器解析请求，识别需要调用 getWeather 工具</li>
            <li>MCP 服务器执行 getWeather 工具，获取天气数据</li>
            <li>MCP 服务器通过 SSE 连接返回结果到前端</li>
            <li>前端展示天气结果给用户</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
