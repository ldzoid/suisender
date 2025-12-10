// Network configuration
export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK as 'mainnet' | 'testnet') || 'mainnet';

// Sui brand colors (from Sui Foundation design system)
export const SUI_COLORS = {
  primary: '#6fbcf0', // Sui blue
  primaryDark: '#4da2da',
  primaryLight: '#a8d5f5',
  background: '#f8fafc',
  cardBg: '#ffffff',
  border: '#e2e8f0',
  text: {
    primary: '#0f172a',
    secondary: '#64748b',
    muted: '#94a3b8',
  },
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
} as const;

// App metadata
export const APP_NAME = 'SuiSender - Free Sui Multisender';
export const APP_DESCRIPTION = 'Free Sui multisender tool for batch sending SUI and tokens. Send crypto to multiple addresses in one transaction. Zero fees, open source Sui token multisend.';
export const APP_URL = 'https://suisender.com';
