import axios from 'axios';
import { ModelProvider } from '../types';

export interface DeepSeekConfig {
  apiKey: string;
  modelName: string;
  apiUrl: string;
}

export class DeepSeekProvider implements ModelProvider {
  private config: DeepSeekConfig;
  
  constructor(config: DeepSeekConfig) {
    this.config = config;
  }
  
  async generate(prompt: string): Promise<string> {
    try {
      const response = await axios.post(this.config.apiUrl, {
        model: this.config.modelName,
        messages: [{ role: 'user', content: prompt }]
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating from DeepSeek:', error);
      throw error;
    }
  }
}
