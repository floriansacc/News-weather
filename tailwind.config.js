/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/*.js", "./src/weather/*.js"],
  theme: {
    screens: {
      sm: { max: "600px" },
      md: { min: "600px", max: "1100px" },
      lg: { min: "1100px", max: "1600px" },
    },
    extend: {
      width: {
        128: "32rem",
      },
      borderWidth: {
        DEFAULT: "1px",
      },
    },
  },
};
