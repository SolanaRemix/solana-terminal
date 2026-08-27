'use client';

import { useState, useMemo } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

const MARKETS = ['SOL-PERP', 'BTC-PERP', 'ETH-PERP', 'JUP-PERP', 'BONK-PERP'];

const MOCK_PRICES: Record<string, number> = {
  'SOL-PERP':  155.4,
  'BTC-PERP':  67800,
  'ETH-PERP':  3520,
  'JUP-PERP':  1.24,
  'BONK-PERP': 0.000028,
};

type Position = {
  id: string;
  market: string;
  side: 'long' | 'short';
  leverage: number;
  size: number;
  entryPrice: number;
  takeProfit?: number;
  stopLoss?: number;
  pnlPct: number;
};

const MOCK_POSITIONS: Position[] = [
  { id: '1', market: 'SOL-PERP', side: 'long',  leverage: 50,  size: 10,  entryPrice: 148.0, pnlPct:  4.97 },
  { id: '2', market: 'BTC-PERP', side: 'short', leverage: 10,  size: 0.2, entryPrice: 68900, pnlPct: -1.6  },
];

function liquidationPrice(side: 'long' | 'short', entry: number, leverage: number) {
  const mmRate = 0.5 / 100; // 0.5% maintenance margin
  const margin = 1 / leverage;
  if (side === 'long') return entry * (1 - margin + mmRate);
  return entry * (1 + margin - mmRate);
}

export default function TradePage() {
  const [market, setMarket]     = useState('SOL-PERP');
  const [side, setSide]         = useState<'long' | 'short'>('long');
  const [leverage, setLeverage] = useState(10);
  const [size, setSize]         = useState('');
  const [tp, setTp]             = useState('');
  const [sl, setSl]             = useState('');
  const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);
  const [submitted, setSubmitted] = useState(false);

  const entryPrice = MOCK_PRICES[market] ?? 0;

  const liqPrice = useMemo(
    () => liquidationPrice(side, entryPrice, leverage),
    [side, entryPrice, leverage],
  );

  const notional = useMemo(
    () => parseFloat(size || '0') * entryPrice * leverage,
    [size, entryPrice, leverage],
  );

  const handleOpen = (e: React.FormEvent) => {
    e.preventDefault();
    const sizeNum = parseFloat(size);
    if (!sizeNum || sizeNum <= 0) return;

    const newPos: Position = {
      id: Date.now().toString(),
      market,
      side,
      leverage,
      size: sizeNum,
      entryPrice,
      takeProfit: tp ? parseFloat(tp) : undefined,
      stopLoss:   sl ? parseFloat(sl) : undefined,
      pnlPct: 0,
    };
    setPositions(prev => [newPos, ...prev]);
    setSize(''); setTp(''); setSl('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleClose = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold glow-text text-accent-1">Leverage Trading</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Order form */}
        <GlassPanel title="Open Position">
          <form onSubmit={handleOpen} className="flex flex-col gap-4">
            {/* Market selector */}
            <div>
              <label className="mb-1 block text-xs text-text-muted">Market</label>
              <select
                value={market}
                onChange={e => setMarket(e.target.value)}
                className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-main outline-none focus:border-accent-1/60"
              >
                {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Side toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSide('long')}
                className={`flex-1 rounded py-2 text-sm font-semibold transition-colors
                  ${side === 'long' ? 'bg-success/20 text-success border border-success/40' : 'border border-white/10 text-text-muted hover:border-success/20'}`}
              >
                Long ↑
              </button>
              <button
                type="button"
                onClick={() => setSide('short')}
                className={`flex-1 rounded py-2 text-sm font-semibold transition-colors
                  ${side === 'short' ? 'bg-danger/20 text-danger border border-danger/40' : 'border border-white/10 text-text-muted hover:border-danger/20'}`}
              >
                Short ↓
              </button>
            </div>

            {/* Leverage slider */}
            <div>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-text-muted">Leverage</span>
                <span className="font-bold text-accent-1">{leverage}×</span>
              </div>
              <input
                type="range" min={1} max={250} step={1} value={leverage}
                onChange={e => setLeverage(Number(e.target.value))}
                className="w-full accent-accent-1"
              />
              <div className="mt-1 flex justify-between text-xs text-text-muted">
                <span>1×</span><span>50×</span><span>100×</span><span>250×</span>
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="mb-1 block text-xs text-text-muted">
                Size ({market.replace('-PERP', '')})
              </label>
              <input
                type="number" min="0" step="any" required
                value={size}
                onChange={e => setSize(e.target.value)}
                placeholder="0.00"
                className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-main outline-none focus:border-accent-1/60"
              />
            </div>

            {/* TP / SL */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-text-muted">Take Profit $</label>
                <input
                  type="number" min="0" step="any" value={tp}
                  onChange={e => setTp(e.target.value)}
                  placeholder={side === 'long' ? '> entry' : '< entry'}
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-main outline-none focus:border-success/40"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-text-muted">Stop Loss $</label>
                <input
                  type="number" min="0" step="any" value={sl}
                  onChange={e => setSl(e.target.value)}
                  placeholder={side === 'long' ? '< entry' : '> entry'}
                  className="w-full rounded border border-white/10 bg-white/5 px-3 py-2 text-sm text-text-main outline-none focus:border-danger/40"
                />
              </div>
            </div>

            {/* Order preview */}
            <div className="rounded border border-white/5 bg-white/[0.03] p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-text-muted">Entry Price</span>
                <span className="text-text-main">${entryPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Notional Value</span>
                <span className="text-text-main">${notional.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Liquidation Price</span>
                <span className="text-danger">${liqPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Est. Fee (0.1%)</span>
                <span className="text-text-main">${(notional * 0.001).toFixed(2)}</span>
              </div>
            </div>

            {submitted && (
              <p className="text-center text-xs text-success">
                ✅ Position opened (simulated)
              </p>
            )}

            <Button
              type="submit"
              variant={side === 'long' ? 'primary' : 'danger'}
              className="w-full font-semibold"
            >
              {side === 'long' ? '↑ Open Long' : '↓ Open Short'} {leverage}×
            </Button>
          </form>
        </GlassPanel>

        {/* Open positions */}
        <GlassPanel title="Open Positions">
          {positions.length === 0 ? (
            <p className="text-sm text-text-muted">No open positions.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {positions.map(p => (
                <div key={p.id} className="rounded border border-white/5 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-main">{p.market}</span>
                    <span className={p.side === 'long' ? 'text-success font-bold' : 'text-danger font-bold'}>
                      {p.side.toUpperCase()} {p.leverage}×
                    </span>
                  </div>
                  <div className="mt-1 grid grid-cols-2 gap-x-4 text-xs text-text-muted">
                    <span>Size: {p.size} @ ${p.entryPrice.toLocaleString()}</span>
                    <span className={p.pnlPct >= 0 ? 'text-success' : 'text-danger'}>
                      PnL: {p.pnlPct >= 0 ? '+' : ''}{p.pnlPct.toFixed(2)}%
                    </span>
                    {p.takeProfit && <span>TP: ${p.takeProfit}</span>}
                    {p.stopLoss   && <span>SL: ${p.stopLoss}</span>}
                  </div>
                  <Button
                    variant="danger"
                    className="mt-2 w-full py-1 text-xs"
                    onClick={() => handleClose(p.id)}
                  >
                    Close Position
                  </Button>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      </div>
    </div>
  );
}
