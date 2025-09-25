// src/Themes/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { ConfigProvider } from "antd";
import colors from "./Colors";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [theme, setThemeState] = useState(colors.light);

  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode") || "light";
    setMode(savedMode);
    const currentTheme = savedMode === "light" ? colors.light : colors.dark;
    setThemeState(currentTheme);
    applyCSSVars(currentTheme);
  }, []);

  const applyCSSVars = (themeObj) => {
    for (const key in themeObj) {
      document.documentElement.style.setProperty(`--${key}`, themeObj[key]);
    }
  };

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    const newTheme = newMode === "light" ? colors.light : colors.dark;
    setThemeState(newTheme);
    applyCSSVars(newTheme);
    localStorage.setItem("themeMode", newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      <ConfigProvider theme={{ token: theme }}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export default ThemeContext;
