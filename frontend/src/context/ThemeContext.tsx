"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ThemeContextType {
  dark: boolean;
  toggle: () => void;
  colors: ThemeColors;
}

export interface ThemeColors {
  bg: string;
  bgCard: string;
  bgHover: string;
  bgInput: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  shadow: string;
}

const LIGHT: ThemeColors = {
  bg: "#f9fafb",
  bgCard: "#ffffff",
  bgHover: "#f3f4f6",
  bgInput: "#ffffff",
  text: "#111827",
  textSecondary: "#374151",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  shadow: "0 2px 8px rgba(0,0,0,0.04)",
};

const DARK: ThemeColors = {
  bg: "#0f1117",
  bgCard: "#1a1d27",
  bgHover: "#242734",
  bgInput: "#242734",
  text: "#f1f5f9",
  textSecondary: "#cbd5e1",
  textMuted: "#94a3b8",
  border: "#2d3348",
  borderLight: "#242734",
  shadow: "0 2px 8px rgba(0,0,0,0.3)",
};

const ThemeContext = createContext<ThemeContextType>({
  dark: false,
  toggle: () => {},
  colors: LIGHT,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("agriagent_theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    setDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("agriagent_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("agriagent_theme", "light");
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ dark, toggle, colors: dark ? DARK : LIGHT }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
