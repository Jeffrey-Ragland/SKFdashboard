/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '350px',
        'xs' : '520px',
        'lg2' : '1030px'
      }
    },
  },
  plugins: [],
}

