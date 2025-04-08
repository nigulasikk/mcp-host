# MCP Host

A desktop application that implements the Model Context Protocol (MCP) to help users understand and interact with MCP principles.

## Technical Overview

MCP Host is an Electron.js based desktop application that provides a user-friendly interface for interacting with various AI models through the Model Context Protocol. The application supports multiple model providers and allows users to configure custom MCP servers.

### Key Features

- **Cross-Platform Support**: Works on Windows, macOS, and Linux
- **Multiple Model Providers**: 
  - Ollama (local models)
  - DeepSeek (API-based)
  - Tongyi Qianwen (API-based)
- **MCP Server Configuration**: JSON-based configuration for custom MCP servers
- **Interactive Chat Interface**: User-friendly chat with execution step confirmation
- **Custom MCP Server Definition**: Define and manage your own MCP servers
- **getWeather Demo Tool**: Sample implementation of an MCP tool

### Technology Stack

- **Electron.js**: Cross-platform desktop application framework
- **TypeScript**: Type-safe JavaScript for robust application development
- **React**: UI component library for building the user interface
- **Webpack**: Module bundler for application packaging
- **Electron Store**: Persistent storage for application configuration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nigulasikk/mcp-host.git
   cd mcp-host
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application in development mode:
   ```bash
   npm start
   ```

## Development

### Project Structure

```
mcp-host/
├── src/
│   ├── main/             # Electron main process
│   │   ├── index.ts      # Main entry point
│   │   └── preload.ts    # Preload script for IPC
│   ├── renderer/         # Electron renderer process
│   │   ├── components/   # React components
│   │   ├── index.html    # HTML template
│   │   ├── index.tsx     # Renderer entry point
│   │   └── App.tsx       # Main React component
│   └── lib/              # Shared libraries
│       ├── models/       # Model provider implementations
│       └── mcp/          # MCP protocol implementation
├── dist/                 # Compiled output
├── release/              # Packaged applications
└── package.json          # Project configuration
```

### Available Scripts

- **Start Application**: `npm start`
- **Development Mode**: `npm run dev`
- **Build Application**: `npm run build`
- **Watch Mode**: `npm run watch`
- **Run Tests**: `npm test`
- **Lint Code**: `npm run lint`

## Building and Packaging

### For All Platforms

```bash
npm run build:package
```

### For Windows

```bash
npm run build:package:win
```

### For macOS

```bash
npm run build:package:mac
```

The packaged applications will be available in the `release/` directory.

## Model Configuration

### Ollama

- **Base URL**: URL of your Ollama instance (default: http://localhost:11434)
- **Model Name**: Name of the model to use (e.g., llama2, mistral)

### DeepSeek

- **API Key**: Your DeepSeek API key
- **Model Name**: Name of the DeepSeek model to use

### Tongyi Qianwen

- **API Key**: Your Qianwen API key (set as QWEN_API_KEY environment variable)
- **Model Name**: Name of the Qianwen model to use

## MCP Server Configuration

MCP servers can be configured using the Server Configuration panel. The configuration is stored in JSON format and includes:

- **Server Name**: Friendly name for the server
- **Server URL**: Endpoint URL for the MCP server
- **Authentication**: Authentication method and credentials
- **Tools**: Available tools and their configurations

## License

MIT
