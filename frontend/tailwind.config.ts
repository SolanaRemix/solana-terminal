import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary':    '#050a14',
        'bg-panel':      'rgba(10,18,32,0.7)',
        'accent-1':      '#00f0ff', // electric cyan
        'accent-2':      '#ff00cc', // magenta
        'accent-3':      '#39ff14', // lime
        'text-main':     '#e8f4ff',
        'text-muted':    '#5a7a9a',
        'danger':        '#ff3b5c',
        'success':       '#00e676',
      },
      backdropBlur: { panel: '18px' },
      boxShadow: {
        glow: '0 0 18px rgba(0,240,255,0.35)',
        'glow-mg': '0 0 18px rgba(255,0,204,0.35)',
        'glow-lime': '0 0 18px rgba(57,255,20,0.35)',
      },
      fontFamily: { mono: ['JetBrains Mono', 'monospace'] },
      keyframes: {
        'pulse-glow': {
          '0%,100%': { boxShadow: '0 0 8px rgba(0,240,255,0.4)' },
          '50%':     { boxShadow: '0 0 24px rgba(0,240,255,0.8)' },
        },
      },
      animation: { 'pulse-glow': 'pulse-glow 2s ease-in-out infinite' },
    },
  },
  plugins: [],
};
export default config;
