module.exports = {
  content: [
    "./frontend/src/components/*.js",
    './frontend/src/components/quiz/*.js',
    './frontend/src/components/user/*.js',
    './frontend/src/components/search/*.js',
    './frontend/src/components/staff/*.js',
    './frontend/src/components/staff/create/*.js',
    "./frontend/src/pages/*.js",
    './frontend/src/pages/user/*.js',
    './frontend/src/pages/staff/*.js',
    './frontend/src/pages/staff/quiz/*.js',
    './frontend/src/pages/staff/question/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
}
