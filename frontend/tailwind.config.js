/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fantasy-blue': '#1e3a8a',
        'fantasy-green': '#16a34a',
        'fantasy-red': '#dc2626',
      }
    },
  },
  plugins: [],
}