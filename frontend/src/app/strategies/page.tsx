'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

type Strategy = {
  id: string;
  name: string;
  type: string;
  leverage: string;
  status: 'active' | 'paused';
};

const TEMPLATES = ['Scalper 250x', 'Swing 50x', 'Market-neutral Basis', 'Volatility Breakout'];

const DEFAULT_STRATEGIES: Strategy[] = [
  { id: '1', name: 'Scalper 250x',        type: 'leverage', leverage: '250x', status: 'active' },
  { id: '2', name: 'Pump.fun Sniper',      type: 'sniper',   leverage: 'N/A',  status: 'active' },
  { id: '3', name: 'Funding Harvest Agent',type: 'agent',    leverage: 'N/A',  status: 'paused' },
];

export default function StrategiesPage() {
  const [strategies, setStrategies] = useState<Strategy[]>(DEFAULT_STRATEGIES);

  const toggle = (id: string) =>
    setStrategies(prev =>
      prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s)
    );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold glow-text text-accent-1">Strategies & Agents</h1>
        <Button>+ New Strategy</Button>
      </div>

      {/* Template picker */}
      <GlassPanel title="Preset Templates">
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map(t => (
            <button key={t}
              className="rounded border border-accent-1/30 px-3 py-1 text-xs text-accent-1
                         hover:bg-accent-1/10 transition-colors">
              {t}
            </button>
          ))}
        </div>
      </GlassPanel>

      {/* Active strategies */}
      <GlassPanel title="Your Strategies">
        <div className="flex flex-col gap-3">
          {strategies.map(s => (
            <div key={s.id}
              className="flex items-center justify-between rounded-lg border border-white/5 px-4 py-3">
              <div>
                <p className="font-semibold text-text-main">{s.name}</p>
                <p className="text-xs text-text-muted">{s.type} • leverage {s.leverage}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${s.status === 'active' ? 'text-success' : 'text-text-muted'}`}>
                  {s.status.toUpperCase()}
                </span>
                <Button variant={s.status === 'active' ? 'danger' : 'primary'}
                        onClick={() => toggle(s.id)}>
                  {s.status === 'active' ? 'Pause' : 'Start'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Opportunity indicators panel */}
      <GlassPanel title="Opportunity Indicators — SOL-PERP" glow="magenta">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            'Price Momentum', 'Funding Rate Skew', 'Open Interest',
            'Orderbook Imbalance', 'Volatility Bands', 'Correlation w/ BTC',
            'Whale Activity', 'Liquidity Depth', 'Spread vs CEX',
            'MEV Risk Score', 'Time-of-Day Vol', 'Volume Spike',
          ].map((ind, i) => (
            <div key={ind} className="rounded border border-white/5 px-3 py-2 text-xs">
              <p className="text-text-muted">{ind}</p>
              <p className="mt-1 font-semibold text-accent-1">{(Math.random() * 100).toFixed(1)}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
