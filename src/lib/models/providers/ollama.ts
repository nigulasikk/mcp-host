import axios from 'axios';
import { ModelProvider } from '../types';

export interface OllamaConfig {
  baseUrl: string;
  modelName: string;
}

export class OllamaProvider implements ModelProvider {
  private config: OllamaConfig;
  
  constructor(config: OllamaConfig) {
    this.config = config;
  }
  
  async generate(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${this.config.baseUrl}/api/generate`, {
        model: this.config.modelName,
        prompt
      });
      
      return response.data.response;
    } catch (error) {
      console.error('Error generating from Ollama:', error);
      throw error;
    }
  }
}
