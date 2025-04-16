# MCP Next.js Demo

这是一个使用 Next.js 和 FastMCP 构建的极简 MCP (Model Context Protocol) 演示项目。该项目旨在帮助 MCP 入门者更好地理解整个调用链路，并提供一个可演示的 demo。

## 项目结构

```
mcp-nextjs-demo/
├── src/
│   ├── app/                 # Next.js 应用目录
│   │   ├── api/             # API 路由
│   │   │   └── mcp/         # MCP SSE 接口
│   │   │       └── route.ts
│   │   ├── page.tsx         # 主页面组件
│   │   └── layout.tsx       # 布局组件
│   ├── server/              # 服务器端代码
│   │   ├── mcp-server.ts    # FastMCP 服务器配置
│   │   └── model-provider.ts # 模型提供者实现
├── .env.local               # 环境变量配置
├── package.json
└── README.md
```

## 功能特点

- 使用 Next.js 构建的现代化 Web 应用
- 使用 FastMCP 实现的 MCP 服务器
- 支持通义千问 API 集成
- 示例工具：获取天气信息
- 通过 SSE 实现前后端通信

## 安装和运行

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

创建 `.env.local` 文件并填写相关配置：

```
QWEN_API_KEY=你的通义千问API密钥
QWEN_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
QWEN_MODEL_NAME=qwen-turbo
PORT=3000
```

3. 启动开发服务器

```bash
npm run dev
```

4. 打开浏览器访问 http://localhost:3000

## MCP 调用链路

本项目展示了一个完整的 MCP 调用链路：

1. 用户在前端界面输入查询（例如："查询北京天气"）
2. 前端通过 SSE 连接发送请求到 MCP 服务器
3. MCP 服务器解析请求，识别需要调用的工具（getWeather）
4. MCP 服务器执行相应工具，获取天气数据
5. MCP 服务器通过 SSE 连接返回结果到前端
6. 前端展示天气结果给用户

## 开发指南

### 添加新工具

可以在 `src/server/mcp-server.ts` 文件中添加新的工具：

```typescript
server.addTool({
  name: "toolName",
  description: "Tool description",
  parameters: z.object({
    // 定义工具参数
    param1: z.string().describe("参数1描述"),
    param2: z.number().describe("参数2描述")
  }),
  execute: async (args) => {
    // 工具执行逻辑
    const result = await someFunction(args.param1, args.param2);
    
    return {
      content: [
        { type: "text", text: `结果: ${result}` }
      ]
    };
  },
});
```

### 使用其他模型提供者

可以在 `src/server/model-provider.ts` 中实现其他模型提供者，只需实现 `ModelProvider` 接口：

```typescript
export class NewProvider implements ModelProvider {
  private config: NewProviderConfig;
  
  constructor(config: NewProviderConfig) {
    this.config = config;
  }
  
  async generate(prompt: string): Promise<string> {
    // 实现与新模型提供者的通信逻辑
    // 返回生成的文本
  }
}
```

## 与原 Electron 项目的区别

相比原来的 Electron 项目，这个 Next.js 版本：

1. 移除了 Electron 外层，专注于 MCP 核心功能
2. 使用 Next.js 提供更现代的 Web 开发体验
3. 简化了项目结构，更容易理解
4. 保留了核心的 MCP 调用链路和工具执行流程
5. 使用 SSE 替代了 Electron 的 IPC 通信

## 技术栈

- Next.js 15
- React 19
- TypeScript
- FastMCP
- MCP SDK
- Tailwind CSS
