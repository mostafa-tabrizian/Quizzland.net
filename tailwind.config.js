module.exports = {
  content: ["./frontend/src/components/*.js", "./frontend/src/pages/*.js", './frontend/src/components/quiz/*.js'],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
