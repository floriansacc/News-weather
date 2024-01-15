import { useState, useEffect } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = (value) => {
    setTheme(value);
  };

  const isDarkTheme = theme === "dark" ? true : false;

  return {
    toggleTheme,
    isDarkTheme,
  };
};
