"use client";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export function Page({ children }: { children: React.ReactNode }) {
  return <View style={s.page}>{children}</View>;
}
export function Card({ children }: { children: React.ReactNode }) {
  return <View style={s.card}>{children}</View>;
}
export function H1() {
  return <Text style={s.h1}>Shadow</Text>;
}
export function Row({ children }: { children: React.ReactNode }) {
  return <View style={s.row}>{children}</View>;
}
export function Label({ children }: { children: React.ReactNode }) {
  return <Text style={s.label}>{children}</Text>;
}
export function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput placeholderTextColor="#7f8ab1" style={s.input} {...props} />
  );
}
export function Button({
  title,
  onPressAction,
}: {
  title: string;
  onPressAction?: () => void;
}) {
  return (
    <Pressable onPress={onPressAction} style={s.button}>
      <Text style={s.buttonText}>{title}</Text>
    </Pressable>
  );
}
export function GhostButton({
  title,
  onPressAction,
}: {
  title: string;
  onPressAction?: () => void;
}) {
  return (
    <Pressable onPress={onPressAction} style={s.ghost}>
      <Text style={s.ghostText}>{title}</Text>
    </Pressable>
  );
}
export function Hint({ children }: { children: React.ReactNode }) {
  return <Text style={s.hint}>{children}</Text>;
}

const s = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#0f1420",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#151b2b",
    borderColor: "#232b3d",
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  h1: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
    color: "#e6e9ef",
  },
  row: { gap: 8, marginBottom: 12 },
  label: { fontSize: 13, color: "#e6e9ef", opacity: 0.9 },
  input: {
    borderColor: "#2a3550",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: "#e6e9ef",
    backgroundColor: "#0f1322",
  },
  button: {
    backgroundColor: "#1f2a44",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#323b56",
    marginTop: 8,
  },
  buttonText: { color: "#e6e9ef", fontWeight: "600" },
  ghost: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#3a4566",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  ghostText: { color: "#aeb8d7" },
  hint: { fontSize: 12, color: "#aeb8d7", textAlign: "center", marginTop: 8 },
});
