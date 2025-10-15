// components/SafeModal.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  GestureResponderEvent,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: (e?: GestureResponderEvent) => void;
  title?: string;
  children: React.ReactNode;
  // optional theme overrides
  bg?: string; // content background
  overlay?: string; // scrim color
  borderColor?: string;
  textColor?: string;
};

export default function SafeModal({
  visible,
  onClose,
  title,
  children,
  bg = "#111",
  overlay = "rgba(0,0,0,0.5)",
  borderColor = "#1b1b1b",
  textColor = "#fff",
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose} // Android back
    >
      <SafeAreaView style={[styles.overlay, { backgroundColor: overlay }]}>
        {/* Tap outside to close */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Card */}
        <View style={[styles.card, { backgroundColor: bg, borderColor }]}>
          {/* Header (always render to show close button) */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              {title ?? ""}
            </Text>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={textColor} />
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center", // was initially flex-end for bottom sheet
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  card: {
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    flex: 1,
    textAlign: "center",
    marginBottom: 10,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 9999,
  },
  content: {
    gap: 10,
  },
});
