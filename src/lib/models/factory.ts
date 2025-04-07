import { ModelProvider, ProviderType, ModelConfig } from './types';
import { OllamaProvider, OllamaConfig } from './providers/ollama';
import { DeepSeekProvider, DeepSeekConfig } from './providers/deepseek';
import { QianwenProvider, QianwenConfig } from './providers/qianwen';

export function createProvider(config: ModelConfig): ModelProvider {
  switch (config.provider) {
    case ProviderType.OLLAMA:
      return new OllamaProvider(config.config as OllamaConfig);
    case ProviderType.DEEPSEEK:
      return new DeepSeekProvider(config.config as DeepSeekConfig);
    case ProviderType.QIANWEN:
      return new QianwenProvider(config.config as QianwenConfig);
    default:
      throw new Error(`Unsupported provider type: ${config.provider}`);
  }
}
