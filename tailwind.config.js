/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nintendo: {
          red: '#E60012',
          grey: '#8C8C8C',
          dark: '#2D2D2D',
          light: '#F0F0F0',
          white: '#FFFFFF',
          bg: '#E5E5E5',
        }
      },
      fontFamily: {
        pixel: ['"FusionPixelLatin"', '"FusionPixelZhHans"', '"FusionPixelZhHant"', '"FusionPixelJa"', '"FusionPixelKo"', 'cursive', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'pixel': '4px 4px 0 0 #2D2D2D',
        'pixel-sm': '2px 2px 0 0 #2D2D2D',
        'pixel-lg': '6px 6px 0 0 #2D2D2D',
        'pixel-inset': 'inset 4px 4px 0 0 #202020',
      },
      animation: {
        'bounce-pixel': 'bounce-pixel 0.5s infinite',
      },
      keyframes: {
        'bounce-pixel': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
}
