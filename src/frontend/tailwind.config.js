/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        success: 'oklch(var(--success) / <alpha-value>)',
        warning: 'oklch(var(--warning) / <alpha-value>)',
        'game-orange': 'oklch(var(--orange) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Bricolage Grotesque', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'xp-fly': 'xpFly 1.5s ease-out forwards',
        'shake': 'shake 0.4s ease-out',
        'flash-green': 'flashGreen 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        xpFly: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-80px)', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        flashGreen: {
          '0%': { backgroundColor: 'oklch(0.42 0.18 145 / 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
