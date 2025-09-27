import React, { useState } from "react";
import { FlatList, Pressable, Share, Text, View } from "react-native";
import Card from "../../components/Card";
import CriteriaModal from "../../components/CriteriaModal";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";
import type { Criteria } from "../../context/AppContext";
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
    <Screen backgroundColor={colors.bg} style={{ padding: 16, gap: 12 }}>
      <Card bg={colors.box} style={{ gap: 8 }}>
        <SectionTitle color={colors.fg}>Results</SectionTitle>

        {latest ? (
          <View>
            <Text style={{ color: colors.fg, fontSize: 16 }}>
              Score: <Text style={{ color: colors.accent, fontWeight: "800" }}>{latest.score}/100</Text>
            </Text>

            <Text style={{ color: colors.fg, marginTop: 8, fontWeight: "700" }}>What you did well</Text>
            {latest.positives.map((p, i) => (
              <Text key={`pos-${i}`} style={{ color: colors.accent }}>
                • {p}
              </Text>
            ))}

            <Text style={{ color: colors.fg, marginTop: 8, fontWeight: "700" }}>Suggestions</Text>
            {latest.suggestions.map((s, i) => (
              <Text key={`sug-${i}`} style={{ color: "#ffddba" }}>
                • {s}
              </Text>
            ))}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Pressable onPress={() => setOpen(true)} style={{ backgroundColor: colors.accent, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
                <Text style={{ color: colors.onAccent, fontWeight: "800" }}>Edit Criteria</Text>
              </Pressable>
              <Pressable onPress={shareLatest} style={{ backgroundColor: "#333", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
                <Text style={{ color: colors.fg, fontWeight: "700" }}>Share</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text style={{ color: colors.muted }}>No submissions yet. Record and submit from Home.</Text>
        )}
      </Card>

      <Card bg={colors.box} style={{ flex: 1 }}>
        <SectionTitle color={colors.fg}>History</SectionTitle>
        <FlatList
          data={history}
          keyExtractor={(h) => String(h.id)}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#1b1b1b" }}>
              <Text style={{ color: colors.fg, fontWeight: "700" }}>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text style={{ color: colors.muted }}>Score: {item.score}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: colors.muted }}>No history yet.</Text>}
        />
      </Card>

      <CriteriaModal open={open} onClose={() => setOpen(false)} criteria={criteria} onSave={updateCriteria} />

      <Presets
        onPick={(preset) => {
          const map: Record<string, Criteria> = {
            Sales: { clarity: true, empathy: true, conciseness: true, objectionHandling: true, productKnowledge: true },
            Interview: { clarity: true, empathy: true, conciseness: true, objectionHandling: false, productKnowledge: false },
            Support: { clarity: true, empathy: true, conciseness: true, objectionHandling: true, productKnowledge: false },
          };
          updateCriteria(map[preset]);
        }}
      />
    </Screen>
  );
}

function Presets({ onPick }: { onPick: (p: "Sales" | "Interview" | "Support") => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: 8, marginTop: 4, alignSelf: "center" }}>
      {(["Sales", "Interview", "Support"] as const).map((p) => (
        <Pressable key={p} onPress={() => onPick(p)} style={{ backgroundColor: "#222", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 }}>
          <Text style={{ color: colors.muted }}>{p}</Text>
        </Pressable>
      ))}
    </View>
  );
}
