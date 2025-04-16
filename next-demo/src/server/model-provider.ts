import axios from 'axios';

export interface ModelProvider {
  generate(prompt: string): Promise<string>;
}

export interface QianwenConfig {
  apiKey: string;
  modelName: string;
  apiUrl: string;
}

export class QianwenProvider implements ModelProvider {
  private config: QianwenConfig;
  
  constructor(config: QianwenConfig) {
    this.config = config;
  }
  
  async generate(prompt: string): Promise<string> {
    try {
      const response = await axios.post(this.config.apiUrl, {
        model: this.config.modelName,
        input: {
          messages: [{ role: 'user', content: prompt }]
        }
      }, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.output.choices[0].message.content;
    } catch (error) {
      console.error('Error generating from Qianwen:', error);
      throw error;
    }
  }
}
