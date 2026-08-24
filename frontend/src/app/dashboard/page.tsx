'use client';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

const MOCK_POSITIONS = [
  { market: 'SOL-PERP', side: 'Long',  leverage: '50x',  size: '10 SOL', pnl: '+12.4%', pnlColor: 'text-success' },
  { market: 'BTC-PERP', side: 'Short', leverage: '10x',  size: '0.2 BTC', pnl: '-2.1%',  pnlColor: 'text-danger' },
];

const MOCK_SIGNALS = [
  { type: 'Pump',   market: 'BONK',    msg: 'New launch detected — risk 42/100',  time: '2s ago' },
  { type: 'Perps',  market: 'SOL-PERP', msg: 'Funding rate spike +0.08%',         time: '14s ago' },
  { type: 'Arb',   market: 'ETH-PERP', msg: 'Cross-DEX spread 0.32% detected',   time: '1m ago' },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold glow-text text-accent-1">Dashboard</h1>

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Portfolio Value',  value: '$48,320',  color: 'text-success' },
          { label: 'Open PnL',         value: '+$1,240',  color: 'text-success' },
          { label: 'Active Agents',    value: '3',        color: 'text-accent-1' },
          { label: 'Risk Score',       value: '62 / 100', color: 'text-accent-2' },
        ].map(({ label, value, color }) => (
          <GlassPanel key={label} title={label}>
            <span className={`text-2xl font-bold ${color}`}>{value}</span>
          </GlassPanel>
        ))}
      </div>

      {/* Positions */}
      <GlassPanel title="Active Positions">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted">
              {['Market', 'Side', 'Leverage', 'Size', 'PnL', ''].map(h => (
                <th key={h} className="pb-2 pr-4 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_POSITIONS.map(p => (
              <tr key={p.market} className="border-t border-white/5">
                <td className="py-2 pr-4 text-text-main">{p.market}</td>
                <td className="py-2 pr-4 text-accent-1">{p.side}</td>
                <td className="py-2 pr-4 text-text-muted">{p.leverage}</td>
                <td className="py-2 pr-4 text-text-main">{p.size}</td>
                <td className={`py-2 pr-4 font-bold ${p.pnlColor}`}>{p.pnl}</td>
                <td className="py-2">
                  <Button variant="danger" className="py-1 px-2 text-xs">Close</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>

      {/* Event feed */}
      <GlassPanel title="Live Event Feed">
        <ul className="flex flex-col gap-2">
          {MOCK_SIGNALS.map((s, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 rounded bg-accent-1/10 px-1 text-xs text-accent-1">{s.type}</span>
              <span className="text-text-muted">{s.market}</span>
              <span className="flex-1 text-text-main">{s.msg}</span>
              <span className="text-text-muted">{s.time}</span>
            </li>
          ))}
        </ul>
      </GlassPanel>
    </div>
  );
}
