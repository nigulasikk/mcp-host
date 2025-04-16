# Next.js + FastMCP 演示项目

## 项目介绍

这是一个使用 Next.js 和 FastMCP 构建的极简 MCP (Model Context Protocol) 演示项目。该项目旨在帮助 MCP 入门者更好地理解整个调用链路，并提供一个可演示的 demo。

## 为什么创建这个演示项目

原始的 MCP Host 项目使用 Electron 作为应用框架，这增加了项目的复杂性。对于初学者来说，理解 MCP 的核心概念和调用链路可能会被 Electron 的架构所干扰。

这个 Next.js 版本移除了 Electron 外层，专注于 MCP 的核心功能，使得调用链路更加清晰可见。同时，使用现代化的 Web 技术栈（Next.js）使得项目更易于理解和扩展。

## 如何使用

1. 进入 next-demo 目录
2. 安装依赖：`npm install`
3. 配置环境变量：创建 `.env.local` 文件并添加必要的 API 密钥
4. 启动开发服务器：`npm run dev`
5. 访问 http://localhost:3000 体验 MCP 功能

## 核心功能

- 使用 FastMCP 实现的 MCP 服务器
- 支持通义千问 API 集成
- 示例工具：获取天气信息
- 通过 SSE 实现前后端通信

## 与原 Electron 项目的区别

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

## 后续扩展方向

1. 添加更多工具示例
2. 集成更多模型提供者
3. 改进用户界面，提供更好的交互体验
4. 添加用户认证和多用户支持
5. 实现工具执行历史记录和回放功能
