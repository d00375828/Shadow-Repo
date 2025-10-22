import React, { createContext, useContext } from "react";

export const DARK_COLORS = {
  bg: "#0E0E0E", // main background
  box: "#111418", // surface / card background
  fg: "#FFFFFF", // primary text
  muted: "#A0A3A7", // secondary text
  accent: "#00E6C3", // brand teal
  onAccent: "#000000", // text on accent
  border: "#2A2D30", // outlines
  header: "#1B1E21", // header background
};

// Old Colors
//bg: "#000",
//fg: "#fff",
//muted: "#d1d1d1",
//accent: "#4cff00",
//peach: "#ffddba",
//onAccent: "#000",
//box: "#111",
//border: "#615f5f",

const ThemeCtx = createContext<{
  colors: typeof DARK_COLORS;
  isDark: true;
  toggleTheme: () => void;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeCtx.Provider
      value={{
        colors: DARK_COLORS,
        isDark: true as const,
        toggleTheme: () => {},
      }}
    >
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useTheme must be used within ThemeProvider");
  return v;
}
