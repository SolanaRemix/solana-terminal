import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/dashboard' },
  { label: 'Trade',      href: '/trade' },
  { label: 'Strategies', href: '/strategies' },
  { label: 'Pump Radar', href: '/pump-radar' },
  { label: 'Swap',       href: '/swap' },
  { label: 'Wallet',     href: '/wallet' },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-col gap-2 border-r border-accent-1/10 bg-bg-panel px-4 py-6 backdrop-blur-panel">
      <div className="mb-6 text-xl font-bold glow-text text-accent-1">⚡ Elite</div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="rounded-md px-3 py-2 text-sm text-text-muted transition-colors
                       hover:bg-accent-1/10 hover:text-accent-1"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-xs text-text-muted">v1.0.0 • Free tier</div>
    </aside>
  );
}
