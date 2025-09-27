import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import AppButton from "../../components/AppButton";
import Card from "../../components/Card";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";
import { useApp, useTheme } from "../../context/AppContext";

export default function Training() {
  const { colors } = useTheme();
  const { sessions, avgScore, goals, addGoal, achievements, toggleAchievement } = useApp();
  const [goalText, setGoalText] = useState("");

  const avg = Number.isFinite(avgScore) ? Math.round(avgScore) : 0;
  const progress = Math.min(100, Math.round(((avg || 0) / 100) * 100));

  return (
    <Screen backgroundColor={colors.bg} style={{ padding: 16 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <Card bg={colors.box} style={{ flex: 1 }}>
          <Text style={{ color: colors.muted }}>Total sessions</Text>
          <Text style={{ color: colors.fg, fontSize: 24, fontWeight: "800" }}>{sessions}</Text>
        </Card>
        <Card bg={colors.box} style={{ flex: 1 }}>
          <Text style={{ color: colors.muted }}>Avg score</Text>
          <Text style={{ color: colors.accent, fontSize: 24, fontWeight: "800" }}>{avg || "-"}</Text>
        </Card>
      </View>

      <Card bg={colors.box} style={{ marginTop: 12 }}>
        <SectionTitle color={colors.fg}>Consistency</SectionTitle>
        <View style={{ height: 10, backgroundColor: "#222", borderRadius: 999, overflow: "hidden" }}>
          <View style={{ width: `${progress}%`, backgroundColor: colors.accent, height: "100%" }} />
        </View>
      </Card>

      <Card bg={colors.box} style={{ marginTop: 12 }}>
        <SectionTitle color={colors.fg}>Goals</SectionTitle>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            value={goalText}
            onChangeText={setGoalText}
            placeholder="Add a goal..."
            placeholderTextColor={colors.muted}
            style={{ flex: 1, backgroundColor: "#111", color: colors.fg, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: "#222" }}
          />
          <AppButton
            title="Add"
            onPress={() => {
              if (goalText.trim()) {
                addGoal(goalText.trim());
                setGoalText("");
              }
            }}
            color={colors.accent}
            fg={colors.onAccent}
          />
        </View>

        <View style={{ marginTop: 10, gap: 6 }}>
          {goals.length ? (
            goals.map((g, i) => (
              <Text key={i} style={{ color: colors.fg }}>
                • {g}
              </Text>
            ))
          ) : (
            <Text style={{ color: colors.muted }}>No goals yet.</Text>
          )}
        </View>
      </Card>

      <Card bg={colors.box} style={{ marginTop: 12, flex: 1 }}>
        <SectionTitle color={colors.fg}>Achievements</SectionTitle>
        <View style={{ gap: 8 }}>
          {achievements.map((a, i) => (
            <Text
              key={i}
              onPress={() => toggleAchievement(i)}
              style={{ color: a.done ? colors.accent : colors.muted, paddingVertical: 8 }}
            >
              {a.done ? "✔ " : "○ "} {a.title}
            </Text>
          ))}
        </View>
      </Card>
    </Screen>
  );
}
