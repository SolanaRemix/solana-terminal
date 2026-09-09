import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8"
          style={{ background: 'radial-gradient(ellipse at top, #0a1220 0%, #050a14 70%)' }}>
      <h1 className="text-5xl font-bold glow-text text-accent-1">
        Solana Elite Terminal
      </h1>
      <p className="text-text-muted max-w-xl text-center text-sm">
        Enterprise leverage trading, DEX aggregation, and Pump.fun sniper — all in one modular workspace.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Dashboard',   href: '/dashboard' },
          { label: 'Strategies',  href: '/strategies' },
          { label: 'Pump Radar',  href: '/pump-radar' },
          { label: 'Wallet',      href: '/wallet' },
        ].map(({ label, href }) => (
          <Link key={href} href={href}
                className="glass-panel px-6 py-4 text-center text-accent-1 hover:shadow-glow
                           transition-all duration-200 hover:scale-105">
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
