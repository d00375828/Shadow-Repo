import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  edges?: ("top" | "right" | "bottom" | "left")[];
  backgroundColor?: string;
};

export default function Screen({
  children,
  style,
  edges = ["top", "left", "right"],
  backgroundColor = "#000",
}: Props) {
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
}
