"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme } from "@/types";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("dark");

  const applyTheme = (th: Theme) => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (th === "dark") {
        root.classList.add("dark");
        root.classList.remove("light");
        root.setAttribute("data-theme", "dark");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
        root.setAttribute("data-theme", "light");
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme") as Theme | null;
    const initialTheme: Theme = saved === "light" || saved === "dark" ? saved : "dark";
    applyTheme(initialTheme);
    requestAnimationFrame(() => {
      setThemeState(initialTheme);
    });
  }, []);

  const setTheme = (th: Theme) => {
    setThemeState(th);
    applyTheme(th);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-theme", th);
    }
  };

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
