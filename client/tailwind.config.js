/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pharmacy: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        forest: {
          950: '#062018',
          900: '#0c3c2f',
          800: '#114a3b',
          700: '#185d4b',
          600: '#21735d',
        },
        brandlime: {
          300: '#bef264',
          400: '#a3e635',
          500: '#8ee055',
        },
        pastel: {
          yellow: '#fef08a',
          amber: '#fde047',
          peach: '#fed7aa',
          lilac: '#f3e8ff',
          sky: '#e0f2fe',
          rose: '#ffe4e6',
          mint: '#dcfce7',
        }
      },
    },
  },
  plugins: [],
}
