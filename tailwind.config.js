module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        customxs: ".78rem",
      },
    },
  },
  variants: {
    extend: {
      display: ["hover", "focus", "group-hover"],
    },
  },
  plugins: [],
}
