/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl:    '#F7F4F2',
        ivory:    '#D2CBC0',
        obsidian: '#1D1D1B',
        slate:    '#7A7871',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:  ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
