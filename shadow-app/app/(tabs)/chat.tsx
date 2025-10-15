// app/(tabs)/chat.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import PageHeader from "../../components/PageHeader";
import Screen from "../../components/Screen";
import { useTheme } from "../../context/AppContext";

type Msg = {
  id: string;
  text: string;
  mine: boolean;
  ts: number;
};

export default function Chat() {
  const { colors } = useTheme();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "m3",
      text: "Welcome to Shadow Chat 👋",
      mine: false,
      ts: Date.now() - 100000,
    },
    {
      id: "m2",
      text: "Ask for tips or feedback any time.",
      mine: false,
      ts: Date.now() - 80000,
    },
    {
      id: "m1",
      text: "Sweet! Let’s try it.",
      mine: true,
      ts: Date.now() - 60000,
    },
  ]);

  const sorted = useMemo(
    () => [...messages].sort((a, b) => b.ts - a.ts), // FlatList inverted, newest last visually
    [messages]
  );

  function send() {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [
      { id: String(Date.now()), text: t, mine: true, ts: Date.now() },
      ...m,
    ]);
    setText("");
    // TODO: hook up to your backend later
  }

  return (
    // IMPORTANT: scroll={false} so FlatList isn’t nested in a ScrollView
    <Screen scroll={false} style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Header */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <PageHeader title="Chat" />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          data={sorted}
          keyExtractor={(m) => m.id}
          inverted
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}
          renderItem={({ item }) => (
            <View
              style={{
                marginVertical: 6,
                alignSelf: item.mine ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}
            >
              <View
                style={{
                  backgroundColor: item.mine ? colors.accent : colors.box,
                  borderWidth: item.mine ? 0 : 1,
                  borderColor: colors.border,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 14,
                  borderBottomRightRadius: item.mine ? 4 : 14,
                  borderBottomLeftRadius: item.mine ? 14 : 4,
                }}
              >
                <Text
                  style={{
                    color: item.mine ? colors.onAccent : colors.fg,
                    lineHeight: 20,
                  }}
                >
                  {item.text}
                </Text>
              </View>
            </View>
          )}
        />

        {/* Composer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.bg,
          }}
        >
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message…"
            placeholderTextColor={colors.muted}
            style={{
              flex: 1,
              color: colors.fg,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: Platform.OS === "ios" ? 12 : 8,
            }}
            returnKeyType="send"
            onSubmitEditing={send}
          />
          <Pressable
            onPress={send}
            style={{
              backgroundColor: colors.accent,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="send" size={18} color={colors.onAccent} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
