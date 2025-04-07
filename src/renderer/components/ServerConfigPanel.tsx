import React, { useState } from 'react';

interface McpServerConfig {
  id: string;
  name: string;
  description?: string;
  config: Record<string, any>;
}

interface ServerConfigPanelProps {
  servers: McpServerConfig[];
  onAddServer: (config: McpServerConfig) => Promise<void>;
  onUpdateServer: (id: string, config: Partial<McpServerConfig>) => Promise<void>;
  onRemoveServer: (id: string) => Promise<void>;
}

export const ServerConfigPanel: React.FC<ServerConfigPanelProps> = ({
  servers,
  onAddServer,
  onUpdateServer,
  onRemoveServer
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<McpServerConfig>>({
    id: '',
    name: '',
    description: '',
    config: {}
  });
  const [configJson, setConfigJson] = useState('{}');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      config: {}
    });
    setConfigJson('{}');
    setIsAdding(false);
    setEditingId(null);
    setError(null);
    setJsonError(null);
  };

  const handleEditServer = (server: McpServerConfig) => {
    setFormData({
      ...server,
      config: { ...server.config }
    });
    setConfigJson(JSON.stringify(server.config, null, 2));
    setEditingId(server.id);
    setIsAdding(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfigJson(e.target.value);
    setJsonError(null);
    
    try {
      const parsedJson = JSON.parse(e.target.value);
      setFormData(prev => ({
        ...prev,
        config: parsedJson
      }));
    } catch (err) {
      setJsonError('Invalid JSON format');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!formData.name) {
        throw new Error('Server name is required');
      }
      
      if (jsonError) {
        throw new Error('Please fix the JSON format errors');
      }
      
      if (editingId) {
        await onUpdateServer(editingId, formData);
      } else {
        const serverConfig = {
          ...formData,
          id: formData.id || `server-${Date.now()}`
        } as McpServerConfig;
        
        await onAddServer(serverConfig);
      }
      
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="server-config-panel">
      <div className="panel-header">
        <h2>MCP Server Configuration</h2>
        {!isAdding && !editingId && (
          <button 
            className="add-button"
            onClick={() => setIsAdding(true)}
          >
            Add New Server
          </button>
        )}
      </div>
      
      {(isAdding || editingId) && (
        <form className="server-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Server' : 'Add New Server'}</h3>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="name">Server Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="My MCP Server"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Optional description"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="config">Server Configuration (JSON):</label>
            <textarea
              id="config"
              name="config"
              value={configJson}
              onChange={handleJsonChange}
              placeholder="Enter server configuration in JSON format"
              rows={10}
              className={jsonError ? 'error' : ''}
            />
            {jsonError && <div className="json-error">{jsonError}</div>}
            <div className="json-help">
              <p>Example configuration:</p>
              <pre>{`{
  "baseUrl": "http://localhost:3000",
  "apiKey": "your-api-key",
  "tools": ["getWeather", "searchWeb"],
  "options": {
    "timeout": 30000,
    "maxTokens": 2048
  }
}`}</pre>
            </div>
          </div>
          
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
              disabled={isLoading || !!jsonError}
            >
              {isLoading ? 'Saving...' : (editingId ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      )}
      
      <div className="servers-list">
        <h3>Configured Servers</h3>
        
        {servers.length === 0 ? (
          <div className="empty-state">
            <p>No MCP servers configured yet. Add your first server to get started.</p>
          </div>
        ) : (
          <ul>
            {servers.map(server => (
              <li key={server.id} className="server-item">
                <div className="server-info">
                  <h4>{server.name}</h4>
                  {server.description && <p>{server.description}</p>}
                  <details>
                    <summary>Configuration</summary>
                    <pre>{JSON.stringify(server.config, null, 2)}</pre>
                  </details>
                </div>
                <div className="server-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditServer(server)}
                    disabled={isAdding || !!editingId}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => onRemoveServer(server.id)}
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
