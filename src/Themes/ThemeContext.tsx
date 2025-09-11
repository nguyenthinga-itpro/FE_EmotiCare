import React, { createContext, useState, useContext, ReactNode } from "react";
import { themeLight, themeDark } from "./Colors";

type ThemeType = typeof themeLight;

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (newTheme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>(themeLight);

  const toggleTheme = () => {
    setThemeState(theme === themeLight ? themeDark : themeLight);
  };

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
