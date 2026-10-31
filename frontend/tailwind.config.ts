import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        card: 'var(--card)',
        ink: 'var(--ink)',
        accent: 'var(--accent)',
        night: 'var(--night)',
        panel: 'var(--panel)',
        mute: 'var(--mute)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      letterSpacing: { tightest: '-0.04em', label: '0.05em' },
      boxShadow: {
        mat: '0 20px 40px -20px rgba(0,0,0,.35)',
        matDeep: '0 30px 60px -20px rgba(0,0,0,.5)',
      },
    },
  },
  plugins: [],
};
export default config;
