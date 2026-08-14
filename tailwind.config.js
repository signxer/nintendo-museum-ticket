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
          // Values come from CSS variables so a second theme (the official
          // museum ticket site look) can restyle the whole app by redefining
          // them on .theme-official.
          red: 'rgb(var(--nm-red) / <alpha-value>)',
          grey: 'rgb(var(--nm-grey) / <alpha-value>)',
          dark: 'rgb(var(--nm-dark) / <alpha-value>)',
          light: 'rgb(var(--nm-light) / <alpha-value>)',
          white: 'rgb(var(--nm-white) / <alpha-value>)',
          bg: 'rgb(var(--nm-bg) / <alpha-value>)',
        }
      },
      fontFamily: {
        pixel: 'var(--nm-font-pixel)',
        sans: 'var(--nm-font-sans)',
      },
      boxShadow: {
        'pixel': '4px 4px 0 0 #2D2D2D',
        'pixel-sm': '2px 2px 0 0 #2D2D2D',
        'pixel-lg': '6px 6px 0 0 #2D2D2D',
        'pixel-inset': 'inset 4px 4px 0 0 #202020',
      }
    },
  },
  plugins: [],
}
