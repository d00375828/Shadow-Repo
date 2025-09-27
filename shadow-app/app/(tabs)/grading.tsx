import React from "react";
import { Pressable, Share, Text, View, useWindowDimensions } from "react-native";
import Card from "../../components/Card";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";
import CriteriaModal from "../../components/CriteriaModal";
import { useApp, useTheme } from "../../context/AppContext";
import useIsLandscape from "../../hooks/useIsLandscape";

export default function Grading() {
  const { colors } = useTheme();
  const { history, criteria, updateCriteria } = useApp();
  const [open, setOpen] = React.useState(false);

  const isLandscape = useIsLandscape();
  const { width } = useWindowDimensions();
  const colWidth = isLandscape ? Math.max(320, Math.min(560, width / 2 - 24)) : undefined;

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
    <Screen backgroundColor={colors.bg} style={{ padding: 16 }}>
      <View
        style={{
          flexDirection: isLandscape ? "row" : "column",
          flexWrap: isLandscape ? "wrap" : "nowrap",
          gap: 12,
          justifyContent: "space-between",
        }}
      >
        {/* Results */}
        <View style={{ width: isLandscape ? colWidth : "100%" }}>
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
        </View>

        {/* History */}
        <View style={{ width: isLandscape ? colWidth : "100%" }}>
          <Card bg={colors.box} style={{ gap: 8 }}>
            <SectionTitle color={colors.fg}>History</SectionTitle>

            <View>
              {history.length === 0 ? (
                <Text style={{ color: colors.muted }}>No history yet.</Text>
              ) : (
                history.map((item) => (
                  <View
                    key={item.id}
                    style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#1b1b1b" }}
                  >
                    <Text style={{ color: colors.fg, fontWeight: "700" }}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                    <Text style={{ color: colors.muted }}>Score: {item.score}</Text>
                  </View>
                ))
              )}
            </View>
          </Card>
        </View>
      </View>

      <CriteriaModal open={open} onClose={() => setOpen(false)} criteria={criteria} onSave={updateCriteria} />
    </Screen>
  );
}
