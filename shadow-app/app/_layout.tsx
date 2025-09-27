import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider, useTheme } from "../context/AppContext";

function ThemedBar() {
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? "light" : "dark"} />;
}

export default function RootLayout() {
  return (
    <AppProvider>
      <SafeAreaProvider>
        <ThemedBar />
        <Slot />
      </SafeAreaProvider>
    </AppProvider>
  );
}
