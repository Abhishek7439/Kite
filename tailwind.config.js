/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kite: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          accent: '#6366f1',
          'accent-light': '#818cf8',
          'accent-dark': '#4f46e5',
          glow: '#a78bfa',
        },
      },
      backgroundImage: {
        'glass': 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.5))',
        'glass-light': 'linear-gradient(135deg, rgba(51, 65, 85, 0.5), rgba(30, 41, 59, 0.3))',
        'gradient-accent': 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
        'gradient-card': 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.25)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.3)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(99, 102, 241, 0.1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeInUp 0.4s ease-out',
        'fade-in-slow': 'fadeInUp 0.6s ease-out',
      },
    },
  },
  plugins: [],
  darkMode: 'class'
}
