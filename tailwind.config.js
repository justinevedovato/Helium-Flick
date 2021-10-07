module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        customxs: '.78rem',
      },
      colors: {
        seagreen: '#349f58',
        eastblue: '#2596be',
        blumine: '#1a6985',
        corn: '#D0ce00',
      },
    },
  },
  variants: {
    extend: {
      display: ['hover', 'focus', 'group-hover'],
      visibility: ['hover', 'focus', 'group-hover'],
    },
  },
  plugins: [],
}
