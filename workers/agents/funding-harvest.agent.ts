import type { Agent, AgentConfig, AgentState, AgentEvent } from './agent.interface';

/**
 * Funding Harvest Agent  (market-neutral basis strategy)
 *
 * Captures funding-rate yield by holding equal and opposite positions on
 * a perp market and a spot market so that price exposure is neutralised.
 * Profit comes from the periodic funding payment when the rate is positive
 * (short perp, long spot) or negative (long perp, short spot via lending).
 *
 * In production, connect to Drift's fundingPaymentHistory and Jupiter spot.
 */
export class FundingHarvestAgent implements Agent {
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
    this.emit({ type: 'info', payload: 'Funding Harvest agent started' });
    // Funding is paid every 8 h on most venues; check every 5 min.
    this.intervalId = setInterval(() => this.tick(), 5 * 60_000);
  }

  async stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.state.status = 'idle';
    this.emit({ type: 'info', payload: 'Funding Harvest agent stopped' });
  }

  private async tick() {
    const market        = (this.config.params.market        as string) ?? 'SOL-PERP';
    const minRate       = (this.config.params.minRatePct    as number) ?? 0.03; // 0.03% threshold
    const positionSize  = (this.config.params.positionSize  as number) ?? 10;   // SOL

    // TODO: Replace with real Drift fundingRate feed.
    const currentRate = (Math.random() - 0.3) * 0.2; // biased slightly positive

    if (Math.abs(currentRate) >= minRate) {
      const perpSide  = currentRate > 0 ? 'short' : 'long';
      const spotSide  = currentRate > 0 ? 'long'  : 'short';
      const annualYield = (Math.abs(currentRate) * 3 * 365).toFixed(2); // 3 payments/day

      this.emit({
        type: 'signal',
        payload: {
          market,
          perpSide,
          spotSide,
          positionSize,
          fundingRate: currentRate.toFixed(4),
          estimatedAnnualYieldPct: annualYield,
          action: 'open_basis_trade',
        },
      });
      // TODO: Open perp position on Drift and spot hedge on Jupiter.
    } else {
      this.emit({
        type: 'info',
        payload: `Funding rate ${currentRate.toFixed(4)}% below threshold ${minRate}% — no trade`,
      });
    }

    this.state.lastRunAt = new Date().toISOString();
    this.state.metrics   = { currentRate, market };
  }
}
