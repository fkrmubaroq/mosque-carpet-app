/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.tsx",
    "./src/pages/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        "poppins": ["Poppins", "sans-serif"],
        "cinzel": ["Cinzel", "sans-serif"],
      },
      colors: {
        "primary": "#15803d",
        "primary-hover": "#166534",
        "secondary": "#eab308",
        "secondary-hover": "#ca8a04",
      },
    },
  },
  plugins: [],
}

