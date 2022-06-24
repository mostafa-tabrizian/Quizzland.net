module.exports = {
  content: ["./frontend/src/components/*.js", "./frontend/src/pages/*.js", './frontend/src/components/quiz/*.js', './frontend/src/pages/user/*.js'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
