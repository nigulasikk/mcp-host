export interface ModelProvider {
  generate(prompt: string): Promise<string>;
}

export enum ProviderType {
  OLLAMA = 'ollama',
  DEEPSEEK = 'deepseek',
  QIANWEN = 'qianwen'
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: ProviderType;
  config: any;
}
