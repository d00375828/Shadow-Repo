// app/(tabs)/grading.tsx
import React, { useState } from "react";
import { FlatList, Pressable, Share, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Card from "../../components/Card";
import CriteriaModal from "../../components/CriteriaModal";
import SectionTitle from "../../components/SectionTitle";
import { useApp, useTheme } from "../../context/AppContext";

export default function Grading() {
  const { colors } = useTheme();
  const { history, criteria, updateCriteria } = useApp();
  const [open, setOpen] = useState(false);

  const latest = history.length > 0 ? history[0] : null;

  async function shareLatest() {
    if (!latest) return;
    const text = `SHADOW Report

Date: ${new Date(latest.createdAt).toLocaleString()}
Score: ${latest.score}/100

Positives:
- ${latest.positives.join("\n- ")}

Suggestions:
- ${latest.suggestions.join("\n- ")}`;
    await Share.share({ message: text });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={history}
        keyExtractor={(h) => String(h.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            <Card bg={colors.box} style={{ gap: 8 }}>
              <SectionTitle color={colors.fg}>Results</SectionTitle>

              {latest ? (
                <View>
                  <Text style={{ color: colors.fg, fontSize: 16 }}>
                    Score:{" "}
                    <Text style={{ color: colors.accent, fontWeight: "800" }}>
                      {latest.score}/100
                    </Text>
                  </Text>

                  <Text
                    style={{
                      color: colors.fg,
                      marginTop: 8,
                      fontWeight: "700",
                    }}
                  >
                    What you did well
                  </Text>
                  {latest.positives.map((p, i) => (
                    <Text key={`pos-${i}`} style={{ color: colors.accent }}>
                      • {p}
                    </Text>
                  ))}

                  <Text
                    style={{
                      color: colors.fg,
                      marginTop: 8,
                      fontWeight: "700",
                    }}
                  >
                    Suggestions
                  </Text>
                  {latest.suggestions.map((s, i) => (
                    <Text key={`sug-${i}`} style={{ color: "#ffddba" }}>
                      • {s}
                    </Text>
                  ))}

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      marginTop: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    <Pressable
                      onPress={() => setOpen(true)}
                      style={{
                        backgroundColor: colors.accent,
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{ color: colors.onAccent, fontWeight: "800" }}
                      >
                        Edit Criteria
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={shareLatest}
                      style={{
                        backgroundColor: "#333",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Text style={{ color: colors.fg, fontWeight: "700" }}>
                        Share
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Text style={{ color: colors.muted }}>
                  No submissions yet. Record and submit from Home.
                </Text>
              )}
            </Card>

            <SectionTitle color={colors.fg}>History</SectionTitle>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/recording/[id]",
                params: { id: String(item.id) },
              })
            }
            style={({ pressed }) => ({
              paddingVertical: 12,
              paddingHorizontal: 12,
              backgroundColor: colors.box,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              marginBottom: 12,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={{ color: colors.fg, fontWeight: "700", marginBottom: 4 }}
            >
              {new Date(item.createdAt).toLocaleString()}
            </Text>
            <Text style={{ color: colors.muted, marginBottom: 6 }}>
              Score: {item.score}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ color: colors.muted, padding: 16 }}>
            No history yet.
          </Text>
        }
      />

      <CriteriaModal
        open={open}
        onClose={() => setOpen(false)}
        criteria={criteria}
        onSave={updateCriteria}
      />
    </SafeAreaView>
  );
}
