/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B21B6',
        primary_light: '#A78BFA',
      },
    },
  },
  plugins: [],
}
