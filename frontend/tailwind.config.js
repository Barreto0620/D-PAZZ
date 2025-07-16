/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Your existing color palette
        primary: '#FFC542',    // Assuming you want to keep your original primary/secondary
        secondary: '#E6A400',  // These are still here but the buttons now use blues for cohesion
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
        },
        // No need to explicitly add blue-900 or cyan-500 here as they are default Tailwind colors.
        // If your logo had very specific custom hex codes for these colors, you would add them here.
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'soft-dark': '0 2px 10px rgba(255, 255, 255, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
};