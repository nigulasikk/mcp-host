import React, { useState } from 'react';
import { ModelConfig, ProviderType } from '../../lib/models/types';

interface ModelConfigPanelProps {
  models: ModelConfig[];
  onAddModel: (config: ModelConfig) => Promise<void>;
  onUpdateModel: (id: string, config: Partial<ModelConfig>) => Promise<void>;
  onRemoveModel: (id: string) => Promise<void>;
}

export const ModelConfigPanel: React.FC<ModelConfigPanelProps> = ({
  models,
  onAddModel,
  onUpdateModel,
  onRemoveModel
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ModelConfig>>({
    id: '',
    name: '',
    provider: ProviderType.OLLAMA,
    config: {
      baseUrl: 'http://localhost:11434',
      modelName: '',
      apiKey: '',
      apiUrl: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      provider: ProviderType.OLLAMA,
      config: {
        baseUrl: 'http://localhost:11434',
        modelName: '',
        apiKey: '',
        apiUrl: ''
      }
    });
    setIsAdding(false);
    setEditingId(null);
    setError(null);
  };

  const handleEditModel = (model: ModelConfig) => {
    setFormData({
      ...model,
      config: { ...model.config }
    });
    setEditingId(model.id);
    setIsAdding(false);
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as ProviderType;
    
    let config = {};
    
    switch (provider) {
      case ProviderType.OLLAMA:
        config = {
          baseUrl: 'http://localhost:11434',
          modelName: ''
        };
        break;
      case ProviderType.DEEPSEEK:
        config = {
          apiKey: '',
          modelName: 'deepseek-coder',
          apiUrl: 'https://api.deepseek.com/v1/chat/completions'
        };
        break;
      case ProviderType.QIANWEN:
        config = {
          apiKey: '',
          modelName: 'qwen-turbo',
          apiUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
        };
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      provider,
      config
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('config.')) {
      const configKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        config: {
          ...prev.config,
          [configKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!formData.name || !formData.provider) {
        throw new Error('Name and provider are required');
      }
      
      switch (formData.provider) {
        case ProviderType.OLLAMA:
          if (!formData.config?.baseUrl || !formData.config?.modelName) {
            throw new Error('Base URL and model name are required for Ollama');
          }
          break;
        case ProviderType.DEEPSEEK:
        case ProviderType.QIANWEN:
          if (!formData.config?.apiKey || !formData.config?.modelName || !formData.config?.apiUrl) {
            throw new Error('API key, model name, and API URL are required');
          }
          break;
      }
      
      if (editingId) {
        await onUpdateModel(editingId, formData);
      } else {
        const modelConfig = {
          ...formData,
          id: formData.id || `${formData.provider}-${Date.now()}`
        } as ModelConfig;
        
        await onAddModel(modelConfig);
      }
      
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const renderConfigFields = () => {
    switch (formData.provider) {
      case ProviderType.OLLAMA:
        return (
          <>
            <div className="form-group">
              <label htmlFor="config.baseUrl">Base URL:</label>
              <input
                type="text"
                id="config.baseUrl"
                name="config.baseUrl"
                value={formData.config?.baseUrl || ''}
                onChange={handleInputChange}
                placeholder="http://localhost:11434"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="config.modelName">Model Name:</label>
              <input
                type="text"
                id="config.modelName"
                name="config.modelName"
                value={formData.config?.modelName || ''}
                onChange={handleInputChange}
                placeholder="llama2"
                required
              />
            </div>
          </>
        );
      
      case ProviderType.DEEPSEEK:
      case ProviderType.QIANWEN:
        return (
          <>
            <div className="form-group">
              <label htmlFor="config.apiKey">API Key:</label>
              <input
                type="password"
                id="config.apiKey"
                name="config.apiKey"
                value={formData.config?.apiKey || ''}
                onChange={handleInputChange}
                placeholder="Enter API key"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="config.modelName">Model Name:</label>
              <input
                type="text"
                id="config.modelName"
                name="config.modelName"
                value={formData.config?.modelName || ''}
                onChange={handleInputChange}
                placeholder={formData.provider === ProviderType.DEEPSEEK ? "deepseek-coder" : "qwen-turbo"}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="config.apiUrl">API URL:</label>
              <input
                type="text"
                id="config.apiUrl"
                name="config.apiUrl"
                value={formData.config?.apiUrl || ''}
                onChange={handleInputChange}
                placeholder={
                  formData.provider === ProviderType.DEEPSEEK 
                    ? "https://api.deepseek.com/v1/chat/completions" 
                    : "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"
                }
                required
              />
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="model-config-panel">
      <div className="panel-header">
        <h2>Model Configuration</h2>
        {!isAdding && !editingId && (
          <button 
            className="add-button"
            onClick={() => setIsAdding(true)}
          >
            Add New Model
          </button>
        )}
      </div>
      
      {(isAdding || editingId) && (
        <form className="model-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Model' : 'Add New Model'}</h3>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Model Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="My Model"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="provider">Provider:</label>
            <select
              id="provider"
              name="provider"
              value={formData.provider}
              onChange={handleProviderChange}
              required
            >
              <option value={ProviderType.OLLAMA}>Ollama</option>
              <option value={ProviderType.DEEPSEEK}>DeepSeek</option>
              <option value={ProviderType.QIANWEN}>Tongyi Qianwen</option>
            </select>
          </div>
          
          {renderConfigFields()}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={resetForm}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      )}
      
      <div className="models-list">
        <h3>Configured Models</h3>
        
        {models.length === 0 ? (
          <div className="empty-state">
            <p>No models configured yet. Add your first model to get started.</p>
          </div>
        ) : (
          <ul>
            {models.map(model => (
              <li key={model.id} className="model-item">
                <div className="model-info">
                  <h4>{model.name}</h4>
                  <p>Provider: {model.provider}</p>
                  <p>
                    {model.provider === ProviderType.OLLAMA 
                      ? `Model: ${model.config.modelName} (${model.config.baseUrl})` 
                      : `Model: ${model.config.modelName}`}
                  </p>
                </div>
                <div className="model-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditModel(model)}
                    disabled={isAdding || !!editingId}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => onRemoveModel(model.id)}
                    disabled={isLoading || isAdding || !!editingId}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
