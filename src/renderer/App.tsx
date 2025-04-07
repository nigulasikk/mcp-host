import React, { useState, useEffect } from 'react';
import { ModelConfig } from '../lib/models/types';
import { ChatInterface } from './components/ChatInterface';
import { ModelConfigPanel } from './components/ModelConfigPanel';
import { ServerConfigPanel } from './components/ServerConfigPanel';

declare global {
  interface Window {
    api: {
      getModelProviders: () => Promise<ModelConfig[]>;
      configureModel: (provider: string, config: any) => Promise<any>;
      getMcpServers: () => Promise<any[]>;
      addMcpServer: (config: any) => Promise<any>;
      updateMcpServer: (id: string, config: any) => Promise<any>;
      removeMcpServer: (id: string) => Promise<boolean>;
      sendMessage: (message: string, modelId: string) => Promise<any>;
      confirmExecutionStep: (stepId: string, allowed: boolean) => Promise<any>;
      getWeather: (location: string) => Promise<any>;
    };
  }
}

interface McpServerConfig {
  id: string;
  name: string;
  description?: string;
  config: Record<string, any>;
}

export const App: React.FC = () => {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [servers, setServers] = useState<McpServerConfig[]>([]);
  const [selectedTab, setSelectedTab] = useState<'chat' | 'models' | 'servers'>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadModels();
    loadServers();
  }, []);
  
  const loadModels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const modelList = await window.api.getModelProviders();
      setModels(modelList);
    } catch (err) {
      console.error('Failed to load models:', err);
      setError(`Failed to load models: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadServers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const serverList = await window.api.getMcpServers();
      setServers(serverList);
    } catch (err) {
      console.error('Failed to load servers:', err);
      setError(`Failed to load servers: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddModel = async (config: ModelConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      await window.api.configureModel(config.provider, config);
      await loadModels();
    } catch (err) {
      console.error('Failed to add model:', err);
      setError(`Failed to add model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateModel = async (id: string, config: Partial<ModelConfig>) => {
    setIsLoading(true);
    setError(null);
    try {
      await window.api.configureModel(config.provider || '', { id, ...config });
      await loadModels();
    } catch (err) {
      console.error('Failed to update model:', err);
      setError(`Failed to update model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveModel = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await loadModels();
    } catch (err) {
      console.error('Failed to remove model:', err);
      setError(`Failed to remove model: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddServer = async (config: McpServerConfig) => {
    setIsLoading(true);
    setError(null);
    try {
      await window.api.addMcpServer(config);
      await loadServers();
    } catch (err) {
      console.error('Failed to add server:', err);
      setError(`Failed to add server: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateServer = async (id: string, config: Partial<McpServerConfig>) => {
    setIsLoading(true);
    setError(null);
    try {
      await window.api.updateMcpServer(id, config);
      await loadServers();
    } catch (err) {
      console.error('Failed to update server:', err);
      setError(`Failed to update server: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveServer = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await window.api.removeMcpServer(id);
      await loadServers();
    } catch (err) {
      console.error('Failed to remove server:', err);
      setError(`Failed to remove server: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirmStep = async (stepId: string, allowed: boolean) => {
    try {
      return await window.api.confirmExecutionStep(stepId, allowed);
    } catch (err) {
      console.error('Failed to confirm execution step:', err);
      setError(`Failed to confirm execution step: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>MCP Host Application</h1>
        <nav>
          <button 
            className={selectedTab === 'chat' ? 'active' : ''}
            onClick={() => setSelectedTab('chat')}
          >
            Chat
          </button>
          <button 
            className={selectedTab === 'models' ? 'active' : ''}
            onClick={() => setSelectedTab('models')}
          >
            Model Configuration
          </button>
          <button 
            className={selectedTab === 'servers' ? 'active' : ''}
            onClick={() => setSelectedTab('servers')}
          >
            Server Configuration
          </button>
        </nav>
      </header>
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      <main className="app-content">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        )}
        
        {selectedTab === 'chat' && (
          <ChatInterface 
            models={models} 
            onConfirmStep={handleConfirmStep} 
          />
        )}
        
        {selectedTab === 'models' && (
          <ModelConfigPanel 
            models={models}
            onAddModel={handleAddModel}
            onUpdateModel={handleUpdateModel}
            onRemoveModel={handleRemoveModel}
          />
        )}
        
        {selectedTab === 'servers' && (
          <ServerConfigPanel 
            servers={servers}
            onAddServer={handleAddServer}
            onUpdateServer={handleUpdateServer}
            onRemoveServer={handleRemoveServer}
          />
        )}
      </main>
    </div>
  );
};
