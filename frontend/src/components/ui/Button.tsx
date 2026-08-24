import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-accent-1/10 border border-accent-1/40 text-accent-1 hover:bg-accent-1/20 hover:shadow-glow',
  danger:  'bg-danger/10  border border-danger/40  text-danger  hover:bg-danger/20',
  ghost:   'bg-transparent border border-white/10   text-text-muted hover:border-white/30',
};

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md px-4 py-2 text-sm font-semibold transition-all duration-150 disabled:opacity-40',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
