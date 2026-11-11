import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand color tokens (Gym / Boutique Fitness emerald theme)
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Semantic System Tokens
        primary: {
          DEFAULT: '#22c55e',
          hover: '#16a34a',
          active: '#15803d',
          subtle: '#dcfce7',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          active: '#4338ca',
          subtle: '#e0e7ff',
          foreground: '#ffffff',
        },
        surface: {
          DEFAULT: '#1e293b', // slate-800
          hover: '#334155',   // slate-700
          active: '#475569',  // slate-600
          card: '#0f172a',    // slate-900
          muted: '#1e293b',
        },
        status: {
          success: '#10b981',
          'success-bg': 'rgba(16, 185, 129, 0.12)',
          warning: '#f59e0b',
          'warning-bg': 'rgba(245, 158, 11, 0.12)',
          error: '#ef4444',
          'error-bg': 'rgba(239, 68, 68, 0.12)',
          info: '#3b82f6',
          'info-bg': 'rgba(59, 130, 246, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.3)',
        modal: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        glow: '0 0 15px -3px rgba(34, 197, 94, 0.3)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
