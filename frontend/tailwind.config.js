/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'fluid': 'clamp(1rem, 5vw, 2rem)',
      }
    },
  },
  plugins: [],
}

