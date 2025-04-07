export interface McpTool {
  name: string;
  description: string;
  parameters: any;
  handler: (params: any) => Promise<any>;
}

export interface McpResource {
  id: string;
  type: string;
  data: any;
}

export interface McpResourceTemplate {
  type: string;
  schema: any;
}

export interface McpPrompt {
  id: string;
  content: string;
  parameters?: any;
}

export interface ExecutionStep {
  id: string;
  tool: string;
  params: any;
}

export interface ExecutionResult {
  status: 'success' | 'error' | 'pending' | 'rejected';
  data?: any;
  message?: string;
}
