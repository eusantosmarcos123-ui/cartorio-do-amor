/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#72092c',
          hover: '#580520',
          light: '#9e1b45',
          soft: '#fbf0f4',
          border: '#e8c4d0',
        },
        accent: {
          DEFAULT: '#c5a059',
          light: '#e8d5a7',
          dark: '#9a7936',
          muted: '#dfc99d',
        },
        surface: {
          DEFAULT: '#faf8f5',
          paper: '#fdfbf7',
          aged: '#f6f1e8',
        },
        parchment: {
          50: '#fdfbf7',
          100: '#f7f2e7',
          200: '#ede2ce',
          300: '#dfcca9',
          800: '#4a3b2c',
          900: '#2c2217',
        },
        stone: {
          750: '#2d2825',
          850: '#1f1b18',
        },
        'text-main': '#1e1b18',
        'text-muted': '#66615b',
        // Google Stitch Romantic Editorial Tokens
        'wine-rich': '#72092C',
        'wine-deep': '#5B0723',
        'wine-crimson': '#8B1E3F',
        'gold-accent': '#C5A059',
        'gold-bright': '#D4AF37',
        'gold-light': '#F5EEDC',
        'parchment-base': '#FDFBF7',
        'parchment-subtle': '#FCF9F2',
        'blush-surface': '#FDF8F7',
        'blush-tint': '#FFF0F3',
        'ink-charcoal': '#1C1917',
        'ink-muted': '#57534E',
        'ink-faint': '#A8A29E',
        'border-romantic': '#EFE5DF',
        'border-gold': '#E5D2A8',
      },
      fontFamily: {
        display: ['Cinzel', 'Playfair Display', 'serif'],
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        cursive: ['"Great Vibes"', '"Dancing Script"', 'cursive'],
        mono: ['"Courier New"', 'monospace'],
      },
      boxShadow: {
        'certificate': '0 25px 60px -15px rgba(44, 34, 23, 0.25), 0 0 0 1px rgba(197, 160, 89, 0.2)',
        'seal': '0 8px 24px -4px rgba(114, 9, 44, 0.35)',
        'gold': '0 0 20px rgba(197, 160, 89, 0.35)',
      },
      backgroundImage: {
        'paper-texture': "radial-gradient(#dfcca9 0.75px, transparent 0.75px)",
      }
    },
  },
  plugins: [],
}
