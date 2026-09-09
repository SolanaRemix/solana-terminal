import type { Agent, AgentConfig, AgentState, AgentEvent } from './agent.interface';

/**
 * Swing 50x Agent
 *
 * Identifies medium-term swing setups on Solana perp markets using
 * funding rate skew and open-interest divergence, then opens leveraged
 * positions sized to a configurable risk-per-trade limit.
 *
 * In production, replace the mock data with real Drift / Jupiter Perps
 * market-data subscriptions.
 */
export class Swing50xAgent implements Agent {
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
    this.emit({ type: 'info', payload: 'Swing 50x agent started' });
    // Swing strategies re-evaluate every 60 s; replace with WS subscription.
    this.intervalId = setInterval(() => this.tick(), 60_000);
  }

  async stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.state.status = 'idle';
    this.emit({ type: 'info', payload: 'Swing 50x agent stopped' });
  }

  private async tick() {
    const leverage   = (this.config.params.leverage   as number) ?? 50;
    const market     = (this.config.params.market     as string) ?? 'SOL-PERP';
    const maxRisk    = (this.config.params.maxRiskPct as number) ?? 2; // % of portfolio

    // TODO: Replace mocks with real funding-rate and OI data.
    const fundingRate   = (Math.random() - 0.5) * 0.2;  // -0.1 .. +0.1 %
    const oiDivergence  = Math.random();                 // 0..1

    const bullish = fundingRate < -0.03 && oiDivergence > 0.6;
    const bearish = fundingRate >  0.03 && oiDivergence < 0.4;

    if (bullish || bearish) {
      const side = bullish ? 'long' : 'short';
      this.emit({
        type: 'signal',
        payload: {
          market,
          side,
          leverage,
          fundingRate: fundingRate.toFixed(4),
          oiDivergence: oiDivergence.toFixed(2),
          maxRiskPct: maxRisk,
          confidence: (Math.abs(fundingRate) * 10).toFixed(2),
        },
      });
      // TODO: Execute via Drift/Jupiter Perps SDK.
    }

    this.state.lastRunAt = new Date().toISOString();
    this.state.metrics   = { fundingRate, oiDivergence, market };
  }
}
