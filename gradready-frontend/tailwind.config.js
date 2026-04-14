/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'usa-maroon': '#800000',
        'usa-maroon-light': '#a41847',
        'usa-maroon-dark': '#5c0000',
        'usa-gold': '#F4C430',
        'usa-gold-light': '#FFD700',
        'usa-gold-dark': '#c9a227',
        'status-cleared': '#22c55e',
        'status-missing': '#ef4444',
        'status-revision': '#f97316',
        'status-submitted': '#3b82f6',
        'status-pending': '#6b7280',
      },
      fontFamily: {
        'heading': ['"Bebas Neue"', 'sans-serif'],
        'body': ['"Manrope"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'progress': 'progress 1s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        },
      },
      backgroundImage: {
        'gradient-maroon': 'linear-gradient(135deg, #800000 0%, #a41847 100%)',
        'gradient-gold': 'linear-gradient(135deg, #F4C430 0%, #FFD700 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      },
    },
  },
  plugins: [],
}
