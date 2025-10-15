// components/SectionTitle.tsx
import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>; // ⬅️ allow style overrides
};

export default function SectionTitle({
  children,
  color = "#fff",
  style,
}: Props) {
  return (
    <Text
      style={[
        {
          color,
          fontSize: 16,
          fontWeight: "800",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
