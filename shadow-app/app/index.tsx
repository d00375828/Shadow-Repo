// Log in page
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppButton from "../components/AppButton";
import Screen from "../components/Screen";
import { useTheme } from "../context/AppContext";

export default function Login() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const faqs = [
    { q: "How is my audio used?", a: "Only for your training session; nothing is uploaded in this demo." },
    { q: "Can I reset my password?", a: "This prototype uses local auth; no reset flow yet." },
    { q: "Who do I contact?", a: "support@shadow.ai" },
  ];

  function signIn() {
    if (!username.trim() || !password.trim()) {
      setError("Enter username and password");
      return;
    }
    setError("");
    router.replace("/(tabs)/home");
  }

  return (
    <Screen backgroundColor={colors.bg}>
      <View style={{ flex: 1, padding: 24, justifyContent: "center" }}>
        <Text style={{ color: colors.fg, fontSize: 36, fontWeight: "800", letterSpacing: 6, textAlign: "center", marginBottom: 48 }}>
          SHADOW
        </Text>

        <View style={{ gap: 12 }}>
          <TextInput
            value={username}
            onChangeText={(t) => { setUsername(t); if (error) setError(""); }}
            placeholder="Username"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            style={{ backgroundColor: colors.box, color: colors.fg, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}
          />

          <View style={{ position: "relative" }}>
            <TextInput
              value={password}
              onChangeText={(t) => { setPassword(t); if (error) setError(""); }}
              placeholder="Password"
              placeholderTextColor={colors.muted}
              secureTextEntry={!showPw}
              style={{ backgroundColor: colors.box, color: colors.fg, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingRight: 60 }}
            />
            <Pressable onPress={() => setShowPw((s) => !s)} style={{ position: "absolute", right: 10, top: 10, padding: 8 }}>
              <Text style={{ color: colors.accent, fontWeight: "700" }}>{showPw ? "Hide" : "Show"}</Text>
            </Pressable>
          </View>

          {!!error && <Text style={{ color: "#ff6666", fontSize: 13 }}>{error}</Text>}

          <AppButton title="Sign In" onPress={signIn} color={colors.accent} fg={colors.onAccent} style={{ marginTop: 8 }} />
        </View>

        <Pressable onPress={() => setOpen(true)} style={{ position: "absolute", right: 16, bottom: 24 }}>
          <Text style={{ color: colors.peach, fontSize: 28, fontWeight: "900" }}>?</Text>
        </Pressable>
      </View>

      {/* Transparent FAQ modal with safe padding inside card */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "#000a", justifyContent: "center", paddingHorizontal: 24 }}>
          <View style={{ backgroundColor: colors.box, borderRadius: 16, padding: 20, gap: 8, paddingTop: 20 + insets.top * 0.25, paddingBottom: 12 + insets.bottom * 0.25 }}>
            <Text style={{ color: colors.fg, fontSize: 18, fontWeight: "700", textAlign: "center" }}>Help & Contact</Text>
            {faqs.map((f, i) => (
              <View key={i} style={{ borderTopWidth: i ? 1 : 0, borderTopColor: colors.border, paddingTop: i ? 8 : 0 }}>
                <Pressable onPress={() => setExpanded(expanded === i ? null : i)}>
                  <Text style={{ color: colors.fg, fontWeight: "600" }}>{f.q}</Text>
                </Pressable>
                {expanded === i && <Text style={{ color: colors.muted, marginTop: 4 }}>{f.a}</Text>}
              </View>
            ))}
            <Pressable onPress={() => setOpen(false)} style={{ alignSelf: "center", marginTop: 8 }}>
              <Text style={{ color: colors.accent, fontWeight: "700" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
