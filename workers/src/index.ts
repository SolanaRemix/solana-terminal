import { Scalper250xAgent } from '../agents/scalper250x.agent';
import { PumpFunSniperAgent } from '../agents/pumpfun-sniper.agent';
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

  const scalper = new Scalper250xAgent(scalperConfig);
  const sniper  = new PumpFunSniperAgent(sniperConfig);

  scalper.onEvent(e => console.log('[scalper]', JSON.stringify(e)));
  sniper.onEvent(e  => console.log('[sniper]',  JSON.stringify(e)));

  await scalper.start();
  await sniper.start();

  process.on('SIGINT', async () => {
    await scalper.stop();
    await sniper.stop();
    process.exit(0);
  });
}

main().catch(console.error);
