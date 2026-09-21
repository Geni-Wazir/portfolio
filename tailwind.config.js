/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./templates/**/*.html', './static/main.js'],
  theme: {
    extend: {
      keyframes: {
        'float-arrow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(5px)' },
        },
      },
      animation: {
        'float-arrow': 'float-arrow 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
