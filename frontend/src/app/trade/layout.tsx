import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Trade | Solana Terminal' };

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
