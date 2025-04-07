import Store from 'electron-store';
import { ModelConfig, ProviderType } from './types';

type ModelStore = {
  get: (key: string) => any;
  set: (key: string, value: any) => void;
};

export class ModelManager {
  private store: ModelStore;
  
  constructor() {
    this.store = new Store({
      name: 'model-configs',
      defaults: {
        models: {}
      }
    }) as unknown as ModelStore;
  }
  
  getModels(): ModelConfig[] {
    return Object.values(this.store.get('models') as Record<string, ModelConfig> || {});
  }
  
  getModel(id: string): ModelConfig | undefined {
    const models = this.store.get('models') as Record<string, ModelConfig> || {};
    return models[id];
  }
  
  addModel(config: ModelConfig): ModelConfig {
    const models = this.store.get('models') as Record<string, ModelConfig> || {};
    models[config.id] = config;
    this.store.set('models', models);
    return config;
  }
  
  updateModel(id: string, config: Partial<ModelConfig>): ModelConfig | undefined {
    const models = this.store.get('models') as Record<string, ModelConfig> || {};
    const existingModel = models[id];
    
    if (!existingModel) {
      return undefined;
    }
    
    const updatedModel = { ...existingModel, ...config };
    models[id] = updatedModel;
    this.store.set('models', models);
    
    return updatedModel;
  }
  
  removeModel(id: string): boolean {
    const models = this.store.get('models') as Record<string, ModelConfig> || {};
    
    if (!models[id]) {
      return false;
    }
    
    delete models[id];
    this.store.set('models', models);
    
    return true;
  }
  
  addDefaultModels() {
    const defaultModels: ModelConfig[] = [
      {
        id: 'ollama-llama2',
        name: 'Ollama Llama2',
        provider: ProviderType.OLLAMA,
        config: {
          baseUrl: 'http://localhost:11434',
          modelName: 'llama2'
        }
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        provider: ProviderType.DEEPSEEK,
        config: {
          apiKey: process.env.DEEPSEEK_API_KEY || '',
          modelName: 'deepseek-coder',
          apiUrl: 'https://api.deepseek.com/v1/chat/completions'
        }
      },
      {
        id: 'qianwen-base',
        name: 'Tongyi Qianwen',
        provider: ProviderType.QIANWEN,
        config: {
          apiKey: process.env.QWEN_API_KEY || '',
          modelName: 'qwen-turbo',
          apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
        }
      }
    ];
    
    defaultModels.forEach(model => {
      this.addModel(model);
    });
  }
}
