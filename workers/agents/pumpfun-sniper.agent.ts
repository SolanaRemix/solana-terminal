import type { Agent, AgentConfig, AgentState, AgentEvent } from './agent.interface';

/**
 * Pump.fun Sniper Agent
 *
 * Listens for new token launches on Pump.fun, scores them, and optionally
 * executes a buy if the risk score is below the configured threshold.
 *
 * In production, subscribe to the Pump.fun program's on-chain log stream
 * via a Solana WebSocket connection.
 */
export class PumpFunSniperAgent implements Agent {
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
    this.emit({ type: 'info', payload: 'Pump.fun sniper agent started' });

    // Simulate new-launch polling; replace with real log-subscription in production.
    this.intervalId = setInterval(() => this.checkNewLaunches(), 10_000);
  }

  async stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.state.status = 'idle';
    this.emit({ type: 'info', payload: 'Pump.fun sniper agent stopped' });
  }

  private async checkNewLaunches() {
    const maxRisk    = (this.config.params.maxRiskScore as number) ?? 40;
    const buyAmount  = (this.config.params.buyAmountSol as number) ?? 0.01;

    // TODO: Replace with real Pump.fun event listener.
    const mockLaunch = {
      mint:       'MockMint' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      riskScore:  Math.floor(Math.random() * 100),
      launcher:   'KnownLauncher1',
      liquidity:  Math.random() * 50_000,
    };

    this.emit({ type: 'signal', payload: { launch: mockLaunch } });

    if (mockLaunch.riskScore <= maxRisk) {
      this.emit({
        type: 'trade',
        payload: {
          action: 'snipe_buy',
          mint: mockLaunch.mint,
          amountSol: buyAmount,
          riskScore: mockLaunch.riskScore,
          reason: `Risk ${mockLaunch.riskScore} <= threshold ${maxRisk}`,
        },
      });
      // TODO: Execute actual buy via Jupiter swap / Pump.fun SDK.
    }

    this.state.lastRunAt = new Date().toISOString();
    this.state.metrics   = { lastChecked: mockLaunch.mint, riskScore: mockLaunch.riskScore };
  }
}
