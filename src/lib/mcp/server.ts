import { EventEmitter } from 'events';
import { McpTool, McpResource, McpResourceTemplate, McpPrompt, ExecutionResult } from './types';
import { ModelProvider } from '../models/types';

export interface McpServerConfig {
  id: string;
  name: string;
  description?: string;
  modelProvider: ModelProvider;
}

export class McpServer extends EventEmitter {
  private config: McpServerConfig;
  private tools: Map<string, McpTool> = new Map();
  private resources: Map<string, McpResource> = new Map();
  private resourceTemplates: Map<string, McpResourceTemplate> = new Map();
  private prompts: Map<string, McpPrompt> = new Map();
  
  constructor(config: McpServerConfig) {
    super();
    this.config = config;
    
    this.initializeServer();
  }
  
  private initializeServer() {
    this.registerResourceTemplate('weather', {
      type: 'weather',
      schema: {
        location: { type: 'string' },
        units: { type: 'string', enum: ['metric', 'imperial'], default: 'metric' }
      }
    });
    
    this.registerTool('getWeather', {
      name: 'getWeather',
      description: 'Get weather information for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'City or location name' },
          units: { type: 'string', enum: ['metric', 'imperial'], default: 'metric' }
        },
        required: ['location']
      },
      handler: async (params) => {
        this.emit('execution-step', {
          id: Date.now().toString(),
          tool: 'getWeather',
          params
        });
        
        return { status: 'pending' };
      }
    });
  }
  
  registerTool(name: string, tool: McpTool) {
    this.tools.set(name, tool);
  }
  
  registerResource(id: string, resource: McpResource) {
    this.resources.set(id, resource);
  }
  
  registerResourceTemplate(type: string, template: McpResourceTemplate) {
    this.resourceTemplates.set(type, template);
  }
  
  registerPrompt(id: string, prompt: McpPrompt) {
    this.prompts.set(id, prompt);
  }
  
  getTools(): McpTool[] {
    return Array.from(this.tools.values());
  }
  
  getResources(): McpResource[] {
    return Array.from(this.resources.values());
  }
  
  getResourceTemplates(): McpResourceTemplate[] {
    return Array.from(this.resourceTemplates.values());
  }
  
  getPrompts(): McpPrompt[] {
    return Array.from(this.prompts.values());
  }
  
  async callTool(name: string, params: any): Promise<ExecutionResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return {
        status: 'error',
        message: `Tool '${name}' not found`
      };
    }
    
    try {
      return await tool.handler(params);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        status: 'error',
        message: `Error executing tool '${name}': ${errorMessage}`
      };
    }
  }
  
  async handleConfirmation(stepId: string, allowed: boolean, params: any): Promise<ExecutionResult> {
    if (!allowed) {
      return { 
        status: 'rejected', 
        message: 'User rejected execution' 
      };
    }
    
    try {
      const weatherData = await this.getWeatherData(params.location, params.units);
      return {
        status: 'success',
        data: weatherData
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        status: 'error',
        message: `Failed to get weather data: ${errorMessage}`
      };
    }
  }
  
  private async getWeatherData(location: string, units = 'metric') {
    return {
      location,
      temperature: 22,
      units,
      condition: 'Sunny',
      humidity: 45
    };
  }
  
  async generateCompletion(prompt: string): Promise<string> {
    try {
      return await this.config.modelProvider.generate(prompt);
    } catch (error) {
      console.error('Error generating completion:', error);
      throw error;
    }
  }
}
