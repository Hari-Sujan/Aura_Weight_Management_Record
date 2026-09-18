/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f4f7f5',
          100: '#e3eae5',
          200: '#c7d5cd',
          300: '#a3b899', // Soft sage green accent
          400: '#8fa89b',
          500: '#7c9a8a',
          600: '#638071',
          700: '#4f665a',
          800: '#3f5248',
          900: '#2d3b33',
        },
        slate: {
          950: '#0b0f19',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(143, 168, 155, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(143, 168, 155, 0.15)',
      }
    },
  },
  plugins: [],
}
