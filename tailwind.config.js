/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111113',
        secondary: '#303845'
      },
      fontFamily: {
        sans: ['Century Gothic', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}