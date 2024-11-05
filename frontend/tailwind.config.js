/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:
      {
        primary: {
          100: '#d7e8dd',
          200: '#7ba1a4'
        },
        secondary: {
          100: '#4f46e5',
          200: '#1f3b47'}
      },
    },
  },
  plugins: [],
}