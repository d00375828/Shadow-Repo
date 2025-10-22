// theme.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const DARK_COLORS = {
  bg: "#0E0E0E",
  fg: "#FFFFFF",
  muted: "#A0A3A7",
  accent: "#00E6C3",
  onAccent: "#000000",
  box: "#111418",
  border: "#2A2D30",
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

type Palette = typeof DARK_COLORS;
type Overrides = Partial<Palette>;

const THEME_KEY = "themeOverrides";

const ThemeCtx = createContext<{
  colors: Palette;
  isDark: true;

  // new: override controls
  setOverrides: (o: Overrides) => Promise<void>;
  clearOverrides: () => Promise<void>;
} | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load persisted overrides on boot
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(THEME_KEY);
        if (raw) setOverrides(JSON.parse(raw));
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const colors: Palette = useMemo(
    () => ({ ...DARK_COLORS, ...(overrides ?? {}) }),
    [overrides]
  );

  const setAndPersist = async (o: Overrides) => {
    setOverrides(o);
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(o));
  };

  const clear = async () => {
    setOverrides(null);
    await AsyncStorage.removeItem(THEME_KEY);
  };

  // Render only after initial load to avoid a flash of default→overrides
  if (!loaded) return null;

  return (
    <ThemeCtx.Provider
      value={{
        colors,
        isDark: true as const,
        setOverrides: setAndPersist,
        clearOverrides: clear,
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
