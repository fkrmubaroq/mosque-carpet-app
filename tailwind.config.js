/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.jsx",
    "./src/pages/**/*.jsx",
  ],
  theme: {
    extend: {
      boxShadow: {
        "card": "0 0 2px #919eab4d,0 12px 24px -4px #919eab1f!important"
      },
      fontFamily: {
        "poppins": ["Poppins", "sans-serif"],
        "cinzel": ["Cinzel", "sans-serif"],
        "jasans": ["Plus Jakarta Sans", "sans-serif"],
        "soserif": ["'Source Serif 4'", "sans-serif"],
      },
      colors: {
        "background": "white",
        "primary": "#15803d",
        "primary-hover": "#166534",
        "secondary": "#eab308",
        "secondary-hover": "#ca8a04",
        "border-color": "#e5eaef"
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}

