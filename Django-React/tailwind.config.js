module.exports = {
  content: ["./frontend/src/components/*.js"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
