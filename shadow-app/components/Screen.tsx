// components/Screen.tsx
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  style?: ViewStyle | ViewStyle[];
  bottomPadding?: number;
};

export default function Screen({
  children,
  backgroundColor = "#000",
  style,
  bottomPadding = 24,
}: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="always"
          contentContainerStyle={[{ paddingBottom: bottomPadding }, style as any]}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
