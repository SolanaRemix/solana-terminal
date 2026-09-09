import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
  glow?: 'cyan' | 'magenta' | 'lime';
}

const glowMap = {
  cyan:    'border-accent-1/20 shadow-glow',
  magenta: 'border-accent-2/20 shadow-glow-mg',
  lime:    'border-accent-3/20 shadow-glow-lime',
};

export function GlassPanel({ title, children, className, glow = 'cyan' }: PanelProps) {
  return (
    <div className={clsx('glass-panel p-4', glowMap[glow], className)}>
      {title && (
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
