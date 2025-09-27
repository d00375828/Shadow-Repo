import React from "react";
import { Text } from "react-native";

export default function SectionTitle({ children, color = "#fff" }: { children: React.ReactNode; color?: string }) {
  return <Text style={{ color, fontWeight: "800", fontSize: 18, marginBottom: 8 }}>{children}</Text>;
}
