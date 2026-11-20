import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand color tokens (GymPilot signature emerald theme)
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Accent token for CTAs (Warm energetic amber/orange)
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        // Semantic System Tokens (WCAG AA Compliant on Light Backgrounds)
        primary: {
          DEFAULT: '#10b981',
          hover: '#059669',
          active: '#047857',
          subtle: '#ecfdf5',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
          active: '#4338ca',
          subtle: '#eef2ff',
          foreground: '#ffffff',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f8fafc',
          card: '#ffffff',
          dark: '#0f172a',
          hover: '#f1f5f9',
          active: '#e2e8f0',
        },
        status: {
          success: '#059669',
          'success-bg': '#ecfdf5',
          warning: '#d97706',
          'warning-bg': '#fffbeb',
          error: '#dc2626',
          'error-bg': '#fef2f2',
          info: '#2563eb',
          'info-bg': '#eff6ff',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        sm: '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        md: '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        lg: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.05)',
        xl: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.05)',
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 10px 20px -5px rgba(16, 185, 129, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.04)',
        modal: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        glow: '0 0 20px -3px rgba(16, 185, 129, 0.25)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
