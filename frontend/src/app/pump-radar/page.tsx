'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

type Launch = {
  id: string;
  name: string;
  symbol: string;
  riskScore: number;
  volume: string;
  age: string;
  liquidity: string;
  launchers: number;
};

const MOCK_LAUNCHES: Launch[] = [
  { id: '1', name: 'MemeCoin X', symbol: 'MCX',  riskScore: 28, volume: '$42K',  age: '2m',  liquidity: '$12K', launchers: 2 },
  { id: '2', name: 'SolPepe',    symbol: 'SPPE', riskScore: 71, volume: '$8K',   age: '7m',  liquidity: '$2K',  launchers: 1 },
  { id: '3', name: 'DogSol',     symbol: 'DGSOL',riskScore: 45, volume: '$120K', age: '45m', liquidity: '$80K', launchers: 3 },
];

function RiskBadge({ score }: { score: number }) {
  const color = score < 40 ? 'text-success' : score < 65 ? 'text-accent-2' : 'text-danger';
  const label = score < 40 ? '✅ Safe'     : score < 65 ? '⚠️ Medium'     : '💀 High';
  return <span className={`font-bold text-xs ${color}`}>{label} ({score})</span>;
}

export default function PumpRadarPage() {
  const [minRisk, setMinRisk] = useState(0);
  const [sniperEnabled, setSniperEnabled] = useState(false);

  const filtered = MOCK_LAUNCHES.filter(l => l.riskScore >= minRisk);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold glow-text text-accent-1">Pump.fun Radar</h1>
        <Button
          variant={sniperEnabled ? 'danger' : 'primary'}
          onClick={() => setSniperEnabled(v => !v)}
        >
          {sniperEnabled ? '🔴 Sniper ON' : '🟢 Enable Sniper'}
        </Button>
      </div>

      {/* Filters */}
      <GlassPanel title="Filters">
        <div className="flex items-center gap-4 text-sm">
          <label className="text-text-muted">Min Risk Score</label>
          <input
            type="range" min={0} max={100} value={minRisk}
            onChange={e => setMinRisk(Number(e.target.value))}
            className="accent-accent-1 w-40"
          />
          <span className="text-accent-1 w-8">{minRisk}</span>
        </div>
      </GlassPanel>

      {/* Radar table */}
      <GlassPanel title="New Launches">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted">
              {['Token', 'Symbol', 'Risk', 'Volume', 'Age', 'Liquidity', ''].map(h => (
                <th key={h} className="pb-2 pr-4 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className="border-t border-white/5">
                <td className="py-2 pr-4 text-text-main">{l.name}</td>
                <td className="py-2 pr-4 text-accent-1">{l.symbol}</td>
                <td className="py-2 pr-4"><RiskBadge score={l.riskScore} /></td>
                <td className="py-2 pr-4 text-text-muted">{l.volume}</td>
                <td className="py-2 pr-4 text-text-muted">{l.age}</td>
                <td className="py-2 pr-4 text-text-muted">{l.liquidity}</td>
                <td className="py-2">
                  <Button className="py-1 px-2 text-xs">Snipe</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>

      {/* Risk indicator legend */}
      <GlassPanel title="Risk Scoring Legend" glow="lime">
        <ul className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
          {[
            'Launcher Reputation', 'Liquidity Depth', 'Liquidity Lock',
            'Volatility & Volume', 'Holder Distribution', 'Mint Authority',
            'Freeze Authority', 'Whale Activity', 'Rug History',
          ].map(f => (
            <li key={f} className="text-text-muted">• {f}</li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}
