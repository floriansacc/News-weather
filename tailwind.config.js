/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/*.js",
    "./src/layout/*.js",
    "./src/weather/*.js",
    "./src/weather/components/*.js",
  ],
  theme: {
    screens: {
      sm: { max: "600px" },
      md: { min: "600px", max: "1100px" },
      lg: { min: "1100px", max: "3000px" },
    },
    extend: {
      textColor: {
        light: "#f1f1f1",
        dark: "#1d1b1e",
      },
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
        dim: " 0 0 0 200vmax rgba(0, 0, 0, .3)",
      },
      transitionProperty: {
        shadowbox: "box-shadow",
        translate: "translateX",
        bgground: "background",
      },
      backgroundImage: {
        perso1: "linear-gradient(300deg,#c5e2f7 2%,#92bad2 20%,#53789e 70%)", // rainy
        perso2: "linear-gradient(13deg, #cce5ec, #fffafa 50%, #93e7fb 100%)", // snowy
        perso3: "linear-gradient(45deg, #d8d2cf, #d4e6ed 80%)", // cloudy
        perso4: "linear-gradient(45deg, #d8d2cf, #d4e6ed 60%, #ffcc00 110%)", //partially cloudy
        perso5: "linear-gradient(225deg, #ffcc00, #e5d075 30%, #f5e0b0 70%)", // sunny
        perso6: "linear-gradient(112.1deg, #202639 11.4%, #3f4c77 70.2%)", // night
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
