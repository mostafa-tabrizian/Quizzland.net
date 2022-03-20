module.exports = {
  content: ["./frontend/src/components/*.js", "./frontend/src/pages/*.js"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
