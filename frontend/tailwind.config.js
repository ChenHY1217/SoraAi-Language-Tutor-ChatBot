/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xsm': '560px',
    },

    extend: {
      colors:
      {
        primary: {
          100: '#d7e8dd',
          200: '#7ba1a4',
          300: '#a1c4fd',
          400: '#89f7fe',
          500: '#00c6ff',
        },
        secondary: {
          100: '#4f46e5',
          200: '#1f3b47',
          300: '#c2e9fb',
          400: '#66a6ff',
          500: '#0072ff',
        }
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}