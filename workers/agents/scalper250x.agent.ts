import type { Agent, AgentConfig, AgentState, AgentEvent } from './agent.interface';

/**
 * Scalper 250x Agent
 *
 * Monitors a perpetuals market for momentum signals and opens
 * leveraged positions according to the configured risk parameters.
 *
 * In production, connect this worker to your RPC and Drift/Jupiter Perps SDK.
 */
export class Scalper250xAgent implements Agent {
  config: AgentConfig;
  state: AgentState = { status: 'idle' };
  private handlers: Array<(e: AgentEvent) => void> = [];
  private intervalId?: NodeJS.Timeout;

  constructor(config: AgentConfig) {
    this.config = config;
  }

  onEvent(handler: (e: AgentEvent) => void) {
    this.handlers.push(handler);
  }

  private emit(event: Omit<AgentEvent, 'agentId' | 'timestamp'>) {
    const full: AgentEvent = {
      ...event,
      agentId: this.config.id,
      timestamp: new Date().toISOString(),
    };
    this.handlers.forEach(h => h(full));
  }

  async start() {
    this.state.status = 'running';
    this.emit({ type: 'info', payload: 'Scalper 250x agent started' });

    // Poll every 5 s for demo; replace with WebSocket subscription in production.
    this.intervalId = setInterval(() => this.tick(), 5_000);
  }

  async stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.state.status = 'idle';
    this.emit({ type: 'info', payload: 'Scalper 250x agent stopped' });
  }

  /** Core tick: fetch indicators, evaluate signal, optionally place order. */
  private async tick() {
    const leverage = (this.config.params.leverage as number) ?? 50;
    const market   = (this.config.params.market   as string) ?? 'SOL-PERP';

    // TODO: Replace mock with real on-chain data from Drift/Jupiter Perps.
    const mockMomentum = Math.random();
    if (mockMomentum > 0.75) {
      const side = mockMomentum > 0.875 ? 'long' : 'short';
      this.emit({
        type: 'signal',
        payload: { market, side, leverage, confidence: mockMomentum.toFixed(2) },
      });
      // TODO: Call on-chain execution here.
    }

    this.state.lastRunAt = new Date().toISOString();
    this.state.metrics = { lastMomentum: mockMomentum, leverage, market };
  }
}
