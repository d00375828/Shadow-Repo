// lib/theme.ts
export const COLORS = {
    bg: "#0E0E0E",
    fg: "#FFFFFF",
    muted: "#A0A3A7",
    accent: "#00E6C3",
    onAccent: "#000000",
    box: "#111418",
    border: "#2A2D30",
  } as const;
  
  export type Colors = typeof COLORS;
  export const theme = { colors: COLORS };
  