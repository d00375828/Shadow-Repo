// A simple card with customizable background and border colors

import React from "react";
import { View, ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  bg?: string;
  border?: string;
};

export default function Card({
  children,
  style,
  bg = "#111",
  border = "#1b1b1b",
}: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: bg,
          borderRadius: 12,
          padding: 12,
          borderWidth: 1,
          borderColor: border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
