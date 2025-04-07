import Store from 'electron-store';
import { McpServer, McpServerConfig } from './server';
import { createProvider } from '../models/factory';
import { ModelConfig } from '../models/types';

type ServerStore = {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
};

export class McpServerManager {
  private store: ServerStore;
  private servers: Map<string, McpServer> = new Map();
  
  constructor() {
    this.store = new Store({
      name: 'mcp-servers',
      defaults: {
        servers: {}
      }
    }) as unknown as ServerStore;
    
    this.loadServers();
  }
  
  private loadServers() {
    const storedServers = this.store.get('servers') as Record<string, McpServerConfig>;
    if (storedServers) {
      Object.values(storedServers).forEach((serverConfig: McpServerConfig) => {
        this.createServer(serverConfig);
      });
    }
  }
  
  getServers() {
    return Array.from(this.servers.values());
  }
  
  getServerConfigs() {
    return this.store.get('servers') as Record<string, McpServerConfig>;
  }
  
  createServer(config: McpServerConfig) {
    const server = new McpServer(config);
    this.servers.set(config.id, server);
    
    const servers = this.store.get('servers') as Record<string, McpServerConfig> || {};
    servers[config.id] = config;
    this.store.set('servers', servers);
    
    return server;
  }
  
  removeServer(id: string) {
    const server = this.servers.get(id);
    if (server) {
      this.servers.delete(id);
      
      const servers = this.store.get('servers') as Record<string, McpServerConfig> || {};
      delete servers[id];
      this.store.set('servers', servers);
      
      return true;
    }
    return false;
  }
  
  createServerFromModelConfig(modelConfig: ModelConfig): McpServer {
    const provider = createProvider(modelConfig);
    const serverConfig: McpServerConfig = {
      id: `server-${modelConfig.id}`,
      name: `${modelConfig.name} Server`,
      modelProvider: provider
    };
    
    return this.createServer(serverConfig);
  }
}
