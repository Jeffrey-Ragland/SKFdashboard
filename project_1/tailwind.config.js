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
      },
      colors:{
        customYellow: 'rgb(255, 255, 228)',
        customYellow2: 'rgb(255, 255, 130)',
      },
    },
  },
  plugins: [],
}

