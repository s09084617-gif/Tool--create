export type ToolId =
  | "web-search"
  | "code-interpreter"
  | "image-generation"
  | "file-analysis"
  | "reasoning";

export interface ToolDefinition {
  id: ToolId;
  label: string;
  description: string;
  icon?: string;
  multiSelect?: boolean;
  disabled?: boolean;
  requiresConfig?: boolean;
  configSchema?: Record<string, unknown>;
  conflictsWith?: ToolId[];
}

export interface ComposerState {
  message: string;
  activeTools: ToolId[];
  toolConfigs: Record<string, unknown>;
  loading: boolean;
  error?: string;
}

export interface MessagePayload {
  message: string;
  tools: ToolId[];
  toolConfigs: Record<string, unknown>;
}
