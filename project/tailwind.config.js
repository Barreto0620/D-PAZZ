/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FFC542',
        secondary: '#E6A400',
        dark: {
          DEFAULT: '#1F1F1F',
          lighter: '#2D2D2D',
          light: '#3A3A3A',
        },
        light: {
          DEFAULT: '#F8F8F8',
          darker: '#E8E8E8',
          darkest: '#D8D8D8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        text: {
          dark: '#1F1F1F',
          light: '#F8F8F8',
          muted: '#6B7280',
        }
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 2px 10px rgba(255, 255, 255, 0.05)',
      },
    },
  },
  plugins: [],
};