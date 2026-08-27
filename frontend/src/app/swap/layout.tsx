import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Swap | Solana Terminal' };

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
