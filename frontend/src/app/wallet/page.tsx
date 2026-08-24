'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

type WalletEntry = {
  id: string;
  label: string;
  publicKey: string;
  mode: 'non-custodial' | 'custodial';
  solBalance: number;
  usdValue: number;
};

const MOCK_WALLETS: WalletEntry[] = [
  { id: '1', label: 'Primary Wallet',   publicKey: '7xKXt...q9Yz', mode: 'non-custodial', solBalance: 18.4,  usdValue: 2760 },
  { id: '2', label: 'Scalper Bot',      publicKey: 'A3pQ2...mN8w', mode: 'custodial',     solBalance: 5.2,   usdValue:  780 },
];

export default function WalletPage() {
  const [wallets] = useState<WalletEntry[]>(MOCK_WALLETS);
  const [paused, setPaused] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold glow-text text-accent-1">Wallet Manager</h1>
        <Button
          variant={paused ? 'primary' : 'danger'}
          onClick={() => setPaused(v => !v)}
        >
          {paused ? '▶ Resume All Bots' : '⏸ Pause All Bots'}
        </Button>
      </div>

      {/* Wallet list */}
      <GlassPanel title="Connected Wallets">
        <div className="flex flex-col gap-3">
          {wallets.map(w => (
            <div key={w.id} className="rounded-lg border border-white/5 px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-main">{w.label}</p>
                  <p className="mt-1 font-mono text-xs text-text-muted">{w.publicKey}</p>
                </div>
                <div className="text-right">
                  <p className="text-success font-bold">{w.solBalance} SOL</p>
                  <p className="text-xs text-text-muted">${w.usdValue.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded bg-accent-1/10 px-2 py-0.5 text-xs text-accent-1">
                  {w.mode}
                </span>
                <Button variant="ghost" className="text-xs py-0.5 px-2">Export Key</Button>
              </div>
            </div>
          ))}
        </div>
        <Button className="mt-4 w-full">+ Generate New Wallet</Button>
      </GlassPanel>

      {/* Exposure breakdown */}
      <GlassPanel title="Exposure by Token" glow="magenta">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted">
              {['Token', 'Amount', 'USD Value', 'Leverage Exposure'].map(h => (
                <th key={h} className="pb-2 pr-4 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { token: 'SOL',  amount: '18.4',  usd: '$2,760',  lev: '1x' },
              { token: 'USDC', amount: '4,200', usd: '$4,200',  lev: '—' },
              { token: 'BTC',  amount: '0.02',  usd: '$1,280',  lev: '10x (short)' },
            ].map(r => (
              <tr key={r.token} className="border-t border-white/5">
                <td className="py-2 pr-4 text-accent-1">{r.token}</td>
                <td className="py-2 pr-4 text-text-main">{r.amount}</td>
                <td className="py-2 pr-4 text-text-main">{r.usd}</td>
                <td className="py-2 pr-4 text-text-muted">{r.lev}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>

      {/* Security notice */}
      <GlassPanel title="Security" glow="lime">
        <p className="text-xs text-text-muted leading-relaxed">
          ⚠️ Private keys are never sent to any server in non-custodial mode.
          All signing happens locally in your browser or desktop app.
          Enable 2FA for withdrawals and automation changes.
        </p>
      </GlassPanel>
    </div>
  );
}
