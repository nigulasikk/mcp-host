import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { ModelManager } from '../lib/models/manager';
import { McpServerManager } from '../lib/mcp/manager';
import { getWeatherData } from '../lib/mcp/tools/getWeather';
import { createProvider } from '../lib/models/factory';

let mainWindow: BrowserWindow | null = null;
let modelManager: ModelManager;
let mcpServerManager: McpServerManager;

function initializeManagers() {
  modelManager = new ModelManager();
  mcpServerManager = new McpServerManager();
  
  if (modelManager.getModels().length === 0) {
    modelManager.addDefaultModels();
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  initializeManagers();
  createWindow();
  setupIpcHandlers();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function setupIpcHandlers() {
  ipcMain.handle('get-model-providers', async () => {
    return modelManager.getModels();
  });

  ipcMain.handle('configure-model', async (event, provider, config) => {
    if (config.id) {
      return modelManager.updateModel(config.id, config);
    } else {
      return modelManager.addModel(config);
    }
  });
  
  ipcMain.handle('get-mcp-servers', async () => {
    return mcpServerManager.getServerConfigs();
  });

  ipcMain.handle('add-mcp-server', async (event, serverConfig) => {
    const server = mcpServerManager.createServer(serverConfig);
    return { success: true, id: serverConfig.id };
  });

  ipcMain.handle('update-mcp-server', async (event, id, config) => {
    mcpServerManager.removeServer(id);
    const server = mcpServerManager.createServer({
      ...config,
      id
    });
    return { success: true, id };
  });

  ipcMain.handle('remove-mcp-server', async (event, id) => {
    return mcpServerManager.removeServer(id);
  });
  
  ipcMain.handle('send-message', async (event, message, modelId) => {
    try {
      const model = modelManager.getModel(modelId);
      if (!model) {
        throw new Error(`Model with ID ${modelId} not found`);
      }
      
      const provider = createProvider(model);
      const response = await provider.generate(message);
      
      return {
        text: response,
        modelId
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  });

  ipcMain.handle('confirm-execution-step', async (event, stepId, allowed) => {
    try {
      const servers = mcpServerManager.getServers();
      if (servers.length === 0) {
        throw new Error('No MCP servers available');
      }
      
      const server = servers[0];
      
      const params = {
        location: 'New York',
        units: 'metric'
      };
      
      return await server.handleConfirmation(stepId, allowed, params);
    } catch (error) {
      console.error('Error confirming execution step:', error);
      throw error;
    }
  });

  ipcMain.handle('get-weather', async (event, location) => {
    try {
      return await getWeatherData(location);
    } catch (error) {
      console.error('Error getting weather data:', error);
      throw error;
    }
  });
}
