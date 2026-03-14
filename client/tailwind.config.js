/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        body: ['Outfit', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg: '#f5f0e8',
        ink: '#1a1108',
        paper: '#faf7f2',
        accent: '#e8411a',
        green: '#2d6a4f',
        muted: '#8a8070',
        border: '#d4cfc5',
      },
    },
  },
  plugins: [],
};
