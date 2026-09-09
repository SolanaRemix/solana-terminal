import { Scalper250xAgent } from '../agents/scalper250x.agent';
import { PumpFunSniperAgent } from '../agents/pumpfun-sniper.agent';
import { Swing50xAgent } from '../agents/swing50x.agent';
import { FundingHarvestAgent } from '../agents/funding-harvest.agent';
import type { AgentConfig } from '../agents/agent.interface';

async function main() {
  console.log('[workers] Starting agents...');

  const scalperConfig: AgentConfig = {
    id: 'scalper-1', userId: 'demo-user', type: 'scalper250x',
    params: { market: 'SOL-PERP', leverage: 250 },
  };
  const sniperConfig: AgentConfig = {
    id: 'sniper-1', userId: 'demo-user', type: 'pumpfun-sniper',
    params: { maxRiskScore: 35, buyAmountSol: 0.01 },
  };
  const swingConfig: AgentConfig = {
    id: 'swing-1', userId: 'demo-user', type: 'swing50x',
    params: { market: 'SOL-PERP', leverage: 50, maxRiskPct: 2 },
  };
  const harvestConfig: AgentConfig = {
    id: 'harvest-1', userId: 'demo-user', type: 'funding-harvest',
    params: { market: 'SOL-PERP', minRatePct: 0.03, positionSize: 10 },
  };

  const scalper  = new Scalper250xAgent(scalperConfig);
  const sniper   = new PumpFunSniperAgent(sniperConfig);
  const swing    = new Swing50xAgent(swingConfig);
  const harvest  = new FundingHarvestAgent(harvestConfig);

  scalper.onEvent(e  => console.log('[scalper]',  JSON.stringify(e)));
  sniper.onEvent(e   => console.log('[sniper]',   JSON.stringify(e)));
  swing.onEvent(e    => console.log('[swing]',    JSON.stringify(e)));
  harvest.onEvent(e  => console.log('[harvest]',  JSON.stringify(e)));

  await scalper.start();
  await sniper.start();
  await swing.start();
  await harvest.start();

  process.on('SIGINT', async () => {
    await Promise.all([scalper.stop(), sniper.stop(), swing.stop(), harvest.stop()]);
    process.exit(0);
  });
}

main().catch(console.error);
