/** Shared domain types */

export type Tier = 'free' | 'pro' | 'elite';

export interface User {
  id: string;
  email: string;
  tier: Tier;
}

export interface Strategy {
  id: string;
  userId: string;
  type: string;
  config: Record<string, unknown>;
  status: 'active' | 'paused';
}

export interface WalletAccount {
  id: string;
  userId: string;
  publicKey: string;
  mode: 'custodial' | 'non-custodial';
}

export interface Signal {
  id: string;
  type: string;
  market: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface Position {
  id: string;
  userId: string;
  market: string;
  side: 'long' | 'short';
  leverage: number;
  size: number;
  entryPrice: number;
  takeProfit?: number;
  stopLoss?: number;
}

export interface Trade {
  id: string;
  positionId: string;
  txHash: string;
  pnl: number;
  timestamp: string;
}

/** Opportunity indicator names */
export const OPPORTUNITY_INDICATORS = [
  'Price Momentum',
  'Funding Rate Skew',
  'Open Interest',
  'Orderbook Imbalance',
  'Volatility Bands',
  'Correlation w/ BTC',
  'Whale Activity',
  'Liquidity Depth',
  'Spread vs CEX',
  'MEV Risk Score',
  'Time-of-Day Volatility',
  'Volume Spike',
] as const;

export type OpportunityIndicator = typeof OPPORTUNITY_INDICATORS[number];
