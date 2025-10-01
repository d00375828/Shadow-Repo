// app/recording/[id].tsx
import React, { useMemo } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Share, Text, View, Pressable, ScrollView } from "react-native";
import Screen from "../../components/Screen";
import Card from "../../components/Card";
import SectionTitle from "../../components/SectionTitle";
import AudioPlayer from "../../components/AudioPlayer";
import { useApp, useTheme } from "../../context/AppContext";

export default function RecordingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { history } = useApp();

  const rec = useMemo(
    () => history.find((h) => String(h.id) === String(id)),
    [history, id]
  );

  if (!rec) {
    return (
      <Screen backgroundColor={colors.bg} style={{ padding: 16 }}>
        <Text style={{ color: colors.fg, fontWeight: "800", fontSize: 18 }}>
          Recording not found
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            marginTop: 12,
            padding: 10,
            backgroundColor: colors.box,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: colors.fg }}>Go Back</Text>
        </Pressable>
      </Screen>
    );
  }

  // Non-null alias for type safety below
  const r = rec as NonNullable<typeof rec>;

  async function shareDetails() {
    const text = `SHADOW Report

Date: ${new Date(r.createdAt).toLocaleString()}
Score: ${r.score}/100

Positives:
- ${r.positives.join("\n- ")}

Suggestions:
- ${r.suggestions.join("\n- ")}`;
    await Share.share({ message: text });
  }

  return (
    <Screen backgroundColor={colors.bg} style={{ padding: 16 }}>
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
        <Card bg={colors.box} style={{ gap: 8 }}>
          <SectionTitle color={colors.fg}>Recording Details</SectionTitle>

          <Text style={{ color: colors.muted }}>
            {new Date(r.createdAt).toLocaleString()}
          </Text>

          <Text style={{ color: colors.fg, fontSize: 16 }}>
            Score:{" "}
            <Text style={{ color: colors.accent, fontWeight: "800" }}>
              {r.score}/100
            </Text>
          </Text>

          {!!r.audioUri && (
            <View style={{ marginTop: 8 }}>
              {/* AudioPlayer expects { uri, bg?, fg? } */}
              <AudioPlayer
                uri={r.audioUri}
                bg={colors.accent}
                fg={colors.onAccent}
              />
            </View>
          )}

          <Text style={{ color: colors.fg, marginTop: 12, fontWeight: "700" }}>
            What went well
          </Text>
          {r.positives.map((p, i) => (
            <Text key={`pos-${i}`} style={{ color: colors.accent }}>
              • {p}
            </Text>
          ))}

          <Text style={{ color: colors.fg, marginTop: 12, fontWeight: "700" }}>
            Suggestions
          </Text>
          {r.suggestions.map((s, i) => (
            <Text key={`sug-${i}`} style={{ color: "#ffddba" }}>
              • {s}
            </Text>
          ))}

          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                backgroundColor: "#333",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: colors.fg }}>Back</Text>
            </Pressable>
            <Pressable
              onPress={shareDetails}
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: colors.onAccent, fontWeight: "800" }}>
                Share
              </Text>
            </Pressable>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}
