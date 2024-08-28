/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'Poppins',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        serif: ['Merriweather', 'Playfair Display', 'serif'],
        cursive: ['Caveat', 'Comic Sans MS', 'cursive'],
      },
    },
  },
  plugins: [],
};
