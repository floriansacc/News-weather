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
      height: {
        116: "25rem",
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      minWidth: {
        25: "100px",
        33: "130px",
      },
      textIndent: {
        inf: "-3000px",
      },
      gridTemplateColumns: {
        t1: "1fr 1fr 1fr",
      },
      gridAutoRows: {
        t1: "max-content",
      },
      animation: {
        "pulse-slow": "pulse 5s linear infinite",
      },
    },
  },
};
