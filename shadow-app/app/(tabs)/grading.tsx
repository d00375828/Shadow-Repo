// app/(tabs)/grading.tsx
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

import Card from "../../components/Card";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";
import { useTheme } from "../../context/AppContext";

export default function Grading() {
  const { colors } = useTheme();

  return (
    <Screen style={{ padding: 16, backgroundColor: colors.bg }}>
      {/* Header */}
      <Text
        style={{
          color: colors.fg,
          fontSize: 24,
          fontWeight: "800",
          marginBottom: 16,
        }}
      >
        Grading
      </Text>

      {/* Info: where grading items are now */}
      <Card
        bg={colors.box}
        style={{ gap: 8, borderColor: colors.border, borderWidth: 1 }}
      >
        <Text style={{ color: colors.fg, fontWeight: "700", fontSize: 16 }}>
          Where did History go?
        </Text>
        <Text style={{ color: colors.muted }}>
          The History list (your saved recordings) now lives on the{" "}
          <Text style={{ color: colors.fg, fontWeight: "700" }}>Home</Text> tab
          under the record button. Open any item there to review, play, and get
          feedback.
        </Text>

        <Pressable
          onPress={() => router.push("/(tabs)/home")}
          style={{
            marginTop: 12,
            alignSelf: "flex-start",
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: colors.accent,
          }}
        >
          <Text style={{ color: colors.onAccent, fontWeight: "800" }}>
            Go to Home
          </Text>
        </Pressable>
      </Card>

      {/* Optional: rubric / guidance */}
      <View style={{ marginTop: 24 }}>
        <SectionTitle color={colors.fg}>Grading Rubric (Guide)</SectionTitle>

        <Card
          bg={colors.box}
          style={{ gap: 10, borderColor: colors.border, borderWidth: 1 }}
        >
          <Bullet
            text="Opener & rapport (0–20): clear greeting, confident tone, personalization."
            color={colors.fg}
            muted={colors.muted}
          />
          <Bullet
            text="Problem discovery (0–20): asks relevant questions, uncovers pain points."
            color={colors.fg}
            muted={colors.muted}
          />
          <Bullet
            text="Value articulation (0–20): ties benefits to prospect’s pains; concise."
            color={colors.fg}
            muted={colors.muted}
          />
          <Bullet
            text="Objection handling (0–20): acknowledges, clarifies, responds effectively."
            color={colors.fg}
            muted={colors.muted}
          />
          <Bullet
            text="Close & next step (0–20): clear CTA, summarizes, sets follow-up."
            color={colors.fg}
            muted={colors.muted}
          />
          <Text style={{ color: colors.muted, marginTop: 6 }}>
            Tip: open a recording from{" "}
            <Text style={{ color: colors.fg, fontWeight: "700" }}>
              Home → History
            </Text>{" "}
            to apply this rubric while you listen.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

function Bullet({
  text,
  color,
  muted,
}: {
  text: string;
  color: string;
  muted: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
      <View
        style={{
          height: 6,
          width: 6,
          borderRadius: 9999,
          marginTop: 8,
          backgroundColor: color,
          opacity: 0.8,
        }}
      />
      <Text style={{ color: muted, flex: 1 }}>{text}</Text>
    </View>
  );
}
