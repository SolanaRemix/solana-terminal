/**
 * Agent interface – every strategy agent implements this contract.
 */
export interface AgentConfig {
  id: string;
  userId: string;
  type: string;
  params: Record<string, unknown>;
}

export interface AgentState {
  status: 'idle' | 'running' | 'error';
  lastRunAt?: string;
  metrics?: Record<string, unknown>;
}

export interface AgentEvent {
  agentId: string;
  type: 'signal' | 'trade' | 'error' | 'info';
  payload: unknown;
  timestamp: string;
}

export interface Agent {
  config: AgentConfig;
  state: AgentState;
  start(): Promise<void>;
  stop(): Promise<void>;
  onEvent(handler: (event: AgentEvent) => void): void;
}
