import React, { useState, useEffect } from 'react';
import { ModelConfig } from '../../lib/models/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ExecutionStep {
  id: string;
  tool: string;
  params: any;
}

interface ChatInterfaceProps {
  models: ModelConfig[];
  onConfirmStep: (stepId: string, allowed: boolean) => Promise<any>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  models, 
  onConfirmStep 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pendingExecutionStep, setPendingExecutionStep] = useState<ExecutionStep | null>(null);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]?.id || '');
    }
  }, [models, selectedModel]);
  
  useEffect(() => {
    const handleExecutionStep = (event: any, step: ExecutionStep) => {
      setPendingExecutionStep(step);
    };
    
    
    return () => {
    };
  }, []);
  
  const sendMessage = async () => {
    if (!input.trim() || !selectedModel) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await window.api.sendMessage(input, selectedModel);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || 'No response from model',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleConfirmStep = async (allowed: boolean) => {
    if (!pendingExecutionStep) return;
    
    try {
      const result = await onConfirmStep(pendingExecutionStep.id, allowed);
      
      const systemMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: allowed 
          ? `Executed ${pendingExecutionStep.tool} successfully: ${JSON.stringify(result.data)}`
          : `Execution of ${pendingExecutionStep.tool} was rejected by user`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, systemMessage]);
    } catch (error) {
      console.error('Error confirming step:', error);
      
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'system',
        content: `Error confirming step: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setPendingExecutionStep(null);
    }
  };
  
  return (
    <div className="chat-interface">
      <div className="model-selector">
        <label htmlFor="model-select">Select Model:</label>
        <select 
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Select a model</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`message ${message.role}`}
            >
              <div className="message-header">
                <span className="role">{message.role}</span>
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="message system">
            <div className="message-content">
              <p>Loading response...</p>
            </div>
          </div>
        )}
      </div>
      
      {pendingExecutionStep && (
        <div className="execution-step-confirmation">
          <div className="confirmation-header">
            <h3>Confirm Execution Step</h3>
          </div>
          <div className="confirmation-content">
            <p>The model wants to execute the following tool:</p>
            <pre>{pendingExecutionStep.tool}</pre>
            <p>With the following parameters:</p>
            <pre>{JSON.stringify(pendingExecutionStep.params, null, 2)}</pre>
          </div>
          <div className="confirmation-actions">
            <button 
              className="reject-button"
              onClick={() => handleConfirmStep(false)}
            >
              Reject
            </button>
            <button 
              className="confirm-button"
              onClick={() => handleConfirmStep(true)}
            >
              Allow
            </button>
          </div>
        </div>
      )}
      
      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading || !selectedModel || !!pendingExecutionStep}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button 
          onClick={sendMessage}
          disabled={isLoading || !input.trim() || !selectedModel || !!pendingExecutionStep}
        >
          Send
        </button>
      </div>
    </div>
  );
};
