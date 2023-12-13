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
      margin: {
        "1px": "1px",
      },
      width: {
        128: "32rem",
        160: "50rem",
        full5: "105%",
      },
      height: {
        116: "25rem",
        128: "32rem",
      },
      maxHeight: {
        "70vh": "70vh",
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      minHeight: {
        96: "24rem",
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
      colors: {
        purpleflo: "#974ee7",
        blueflo: "#218fff",
      },
      boxShadow: {
        dim: " 0 0 0 100vmax rgba(0, 0, 0, .3)",
      },
      transitionProperty: {
        shadowbox: "box-shadow",
        translate: "translateX",
        bgground: "background",
      },
      backgroundImage: {
        perso1: "linear-gradient(300deg,#c5e2f7 2%,#92bad2 20%,#53789E 70%)",
        perso2: "linear-gradient(105deg, #cce5ec, #fffafa 50%, #93e7fb 100%)",
        perso3: "linear-gradient(45deg, #d8d2cf, #d4e6ed 80%)",
        perso4: "linear-gradient(45deg, #d8d2cf, #d4e6ed 60%, #ffcc00 110%)",
        perso5: "linear-gradient(225deg, #ffcc00, #e5d075 30%, #f5e0b0 70%)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
