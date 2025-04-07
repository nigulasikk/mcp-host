import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getModelProviders: () => ipcRenderer.invoke('get-model-providers'),
  configureModel: (provider: string, config: any) => 
    ipcRenderer.invoke('configure-model', provider, config),
  
  getMcpServers: () => ipcRenderer.invoke('get-mcp-servers'),
  addMcpServer: (config: any) => ipcRenderer.invoke('add-mcp-server', config),
  updateMcpServer: (id: string, config: any) => 
    ipcRenderer.invoke('update-mcp-server', id, config),
  removeMcpServer: (id: string) => ipcRenderer.invoke('remove-mcp-server', id),
  
  sendMessage: (message: string, modelId: string) => 
    ipcRenderer.invoke('send-message', message, modelId),
  confirmExecutionStep: (stepId: string, allowed: boolean) => 
    ipcRenderer.invoke('confirm-execution-step', stepId, allowed),
  
  getWeather: (location: string) => ipcRenderer.invoke('get-weather', location)
});
