/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: '#050505',
          50: '#1a1a1c',
          100: '#161618',
          200: '#121214',
          300: '#0D0D0F',
          400: '#0a0a0c',
          500: '#050505',
        },
        rose: {
          DEFAULT: '#EFA3C4',
          intense: '#E56FA3',
          light: '#F8D8E6',
          50: '#fdf2f7',
          100: '#fce8ef',
          200: '#f8d8e6',
          300: '#f4c5db',
          400: '#efb8d0',
          500: '#EFA3C4',
          600: '#e88bb6',
          700: '#E56FA3',
          800: '#cc5688',
          900: '#a84671',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        script: ['Dancing Script', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
