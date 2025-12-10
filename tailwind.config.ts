import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'sui-primary': '#6fbcf0',
        'sui-primary-dark': '#4da2da',
        'sui-primary-light': '#a8d5f5',
        'sui-bg': '#f8fafc',
        'sui-card': '#ffffff',
        'sui-border': '#e2e8f0',
        'sui-text-primary': '#0f172a',
        'sui-text-secondary': '#64748b',
        'sui-text-muted': '#94a3b8',
        'sui-success': '#10b981',
        'sui-error': '#ef4444',
        'sui-warning': '#f59e0b',
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;