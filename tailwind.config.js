/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-yellow': '#FFD15B',
      },
      fontFamily: {
        'sans': ['Anton', 'system-ui', 'sans-serif'],
        'body': ['Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
