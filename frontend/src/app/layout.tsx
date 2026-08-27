import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Solana Elite Terminal',
  description: 'Enterprise Solana leverage & sniper terminal',
  manifest: '/manifest.json',
  themeColor: '#050a14',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
