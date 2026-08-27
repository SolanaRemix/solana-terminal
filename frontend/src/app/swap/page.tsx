'use client';

import { useState, useMemo } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

const TOKENS = ['SOL', 'USDC', 'USDT', 'BTC', 'ETH', 'JUP', 'BONK', 'WIF'];

type Route = {
  dex: string;
  outputAmount: number;
  priceImpact: number;
  fees: number;
};

function mockRoutes(fromToken: string, toToken: string, amount: number): Route[] {
  if (!amount || fromToken === toToken) return [];
  // Simulate 3 routes with slight variation
  const base = amount * (1 + Math.random() * 0.02 - 0.01);
  return [
    { dex: 'Jupiter (Raydium → Orca)',  outputAmount: base * 0.9991, priceImpact: 0.01, fees: amount * 0.0025 },
    { dex: 'Jupiter (Meteora)',          outputAmount: base * 0.9985, priceImpact: 0.03, fees: amount * 0.002  },
    { dex: 'Raydium Direct',             outputAmount: base * 0.9970, priceImpact: 0.08, fees: amount * 0.003  },
  ].sort((a, b) => b.outputAmount - a.outputAmount);
}

export default function SwapPage() {
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken]     = useState('USDC');
  const [amount, setAmount]       = useState('');
  const [slippage, setSlippage]   = useState(0.5);
  const [confirmed, setConfirmed] = useState(false);

  const routes = useMemo(
    () => mockRoutes(fromToken, toToken, parseFloat(amount) || 0),
    [fromToken, toToken, amount],
  );

  const bestRoute = routes[0];

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bestRoute) return;
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 3000);
  };

  const flip = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold glow-text text-accent-1">Swap Aggregator</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Swap form */}
        <GlassPanel title="Swap via Jupiter">
          <form onSubmit={handleSwap} className="flex flex-col gap-4">
            {/* From */}
            <div>
              <label className="mb-1 block text-xs text-text-muted">From</label>
              <div className="flex gap-2">
                <select
                  value={fromToken}
                  onChange={e => setFromToken(e.target.value)}
                  className="w-28 rounded border border-white/10 bg-white/5 px-2 py-2 text-sm text-text-main outline-none focus:border-accent-1/60"
                >
                  {TOKENS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  type="number" min="0" step="any" required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-main outline-none focus:border-accent-1/60"
                />
              </div>
            </div>

            {/* Flip button */}
            <div className="text-center">
              <button type="button" onClick={flip} className="text-accent-1 hover:opacity-75 text-xl">
                ⇅
              </button>
            </div>

            {/* To */}
            <div>
              <label className="mb-1 block text-xs text-text-muted">To (estimated)</label>
              <div className="flex gap-2">
                <select
                  value={toToken}
                  onChange={e => setToToken(e.target.value)}
                  className="w-28 rounded border border-white/10 bg-white/5 px-2 py-2 text-sm text-text-main outline-none focus:border-accent-1/60"
                >
                  {TOKENS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="flex-1 rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-text-muted">
                  {bestRoute ? bestRoute.outputAmount.toFixed(6) : '—'}
                </div>
              </div>
            </div>

            {/* Slippage */}
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-text-muted">Max Slippage</span>
                <span className="text-accent-1">{slippage}%</span>
              </div>
              <div className="flex gap-2">
                {[0.1, 0.5, 1, 2].map(s => (
                  <button
                    key={s} type="button"
                    onClick={() => setSlippage(s)}
                    className={`rounded px-2 py-0.5 text-xs transition-colors
                      ${slippage === s ? 'bg-accent-1/20 text-accent-1 border border-accent-1/40' : 'border border-white/10 text-text-muted'}`}
                  >
                    {s}%
                  </button>
                ))}
              </div>
            </div>

            {/* Best route summary */}
            {bestRoute && (
              <div className="rounded border border-white/5 bg-white/[0.03] p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-text-muted">Best Route</span>
                  <span className="text-accent-3">{bestRoute.dex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Price Impact</span>
                  <span className={bestRoute.priceImpact > 0.5 ? 'text-danger' : 'text-success'}>
                    {bestRoute.priceImpact}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Network + Protocol Fees</span>
                  <span className="text-text-main">~{bestRoute.fees.toFixed(6)} {fromToken}</span>
                </div>
              </div>
            )}

            {confirmed && (
              <p className="text-center text-xs text-success">
                ✅ Swap submitted (simulated)
              </p>
            )}

            <Button type="submit" disabled={!bestRoute} className="w-full font-semibold">
              Swap {fromToken} → {toToken}
            </Button>
          </form>
        </GlassPanel>

        {/* Route breakdown */}
        <GlassPanel title="All Routes" glow="magenta">
          {routes.length === 0 ? (
            <p className="text-sm text-text-muted">Enter an amount to see route options.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {routes.map((r, i) => (
                <div
                  key={r.dex}
                  className={`rounded border px-4 py-3 text-sm
                    ${i === 0 ? 'border-accent-1/30 bg-accent-1/5' : 'border-white/5'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-main">{r.dex}</span>
                    {i === 0 && <span className="rounded bg-accent-1/20 px-1.5 py-0.5 text-xs text-accent-1">Best</span>}
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-x-4 text-xs text-text-muted">
                    <span>Output: {r.outputAmount.toFixed(6)} {toToken}</span>
                    <span>Impact: {r.priceImpact}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
