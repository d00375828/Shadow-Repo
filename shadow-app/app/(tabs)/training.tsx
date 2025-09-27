import React, { useRef, useState } from "react";
import { Pressable, Text, TextInput, View, useWindowDimensions } from "react-native";
import Card from "../../components/Card";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";
import { useApp, useTheme } from "../../context/AppContext";
import useIsLandscape from "../../hooks/useIsLandscape";

export default function Training() {
  const { colors } = useTheme();
  const {
    sessions,
    streak,
    goalsToday,
    prevGoals,
    managerNotes,
    addTodayGoal,
    toggleTodayGoal,
    completeTodayGoal,
    removePrevGoal,
    setManagerNotes,
  } = useApp();

  const [newGoal, setNewGoal] = useState("");
  const animatingIdsRef = useRef<Set<number>>(new Set());

  const isLandscape = useIsLandscape();
  const { width } = useWindowDimensions();
  const colWidth = isLandscape ? Math.max(320, Math.min(560, width / 2 - 24)) : undefined;

  function onAdd() {
    if (!newGoal.trim()) return;
    addTodayGoal(newGoal);
    setNewGoal("");
  }

  function onToggleWithDelay(id: number, done: boolean) {
    if (!done) {
      toggleTodayGoal(id);
      if (animatingIdsRef.current.has(id)) return;
      animatingIdsRef.current.add(id);
      setTimeout(() => {
        completeTodayGoal(id);
        animatingIdsRef.current.delete(id);
      }, 600);
    }
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
        {/* Stats */}
        <View style={{ width: isLandscape ? colWidth : "100%" }}>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <StatTile label="Total Sessions" value={String(sessions)} />
            <StatTile label="Streak" value={`${streak} day${streak === 1 ? "" : "s"}`} accent />
          </View>
        </View>

        {/* Today's Goals */}
        <View style={{ width: isLandscape ? colWidth : "100%" }}>
          <Card bg={colors.box} style={{ gap: 10 }}>
            <SectionTitle color={colors.fg}>Today's Goals</SectionTitle>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TextInput
                value={newGoal}
                onChangeText={setNewGoal}
                placeholder="Add a goal..."
                placeholderTextColor={colors.muted}
                style={{
                  flex: 1,
                  backgroundColor: "#0e0e0e",
                  color: colors.fg,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                onSubmitEditing={onAdd}
                returnKeyType="done"
              />
              <Pressable
                onPress={onAdd}
                style={{
                  backgroundColor: colors.accent,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: colors.onAccent, fontWeight: "800" }}>Add</Text>
              </Pressable>
            </View>

            {/* Render today's goals */}
            <View style={{ marginTop: 8, gap: 8 }}>
              {goalsToday.length === 0 ? (
                <Text style={{ color: colors.muted }}>No goals yet.</Text>
              ) : (
                goalsToday.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => onToggleWithDelay(item.id, item.done)}
                    style={{
                      backgroundColor: "#0e0e0e",
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 12,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: colors.fg,
                        flex: 1,
                        marginRight: 12,
                        textDecorationLine: item.done ? "line-through" : "none",
                      }}
                    >
                      {item.text}
                    </Text>
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: item.done ? colors.accent : colors.border,
                        backgroundColor: item.done ? colors.accent : "transparent",
                      }}
                    />
                  </Pressable>
                ))
              )}
            </View>
          </Card>
        </View>

        {/* Prev / Accomplished */}
        <View style={{ width: isLandscape ? colWidth : "100%" }}>
          <Card bg={colors.box} style={{ gap: 8 }}>
            <SectionTitle color={colors.fg}>Prev / Accomplished Goals</SectionTitle>

            <View style={{ gap: 8 }}>
              {prevGoals.length === 0 ? (
                <Text style={{ color: colors.muted }}>No accomplished goals yet.</Text>
              ) : (
                prevGoals.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      backgroundColor: "#0e0e0e",
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <Text style={{ color: colors.fg, fontWeight: "700" }}>{item.text}</Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
                      <Text style={{ color: colors.muted }}>
                        {new Date(item.completedAt).toLocaleString()}
                      </Text>
                      <Pressable onPress={() => removePrevGoal(item.id)} hitSlop={10}>
                        <Text style={{ color: "#ff6666" }}>Remove</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>
          </Card>
        </View>

        {/* Manager's Goals */}
        <View style={{ width: isLandscape ? colWidth : "100%" }}>
          <Card bg={colors.box} style={{ gap: 8 }}>
            <SectionTitle color={colors.fg}>Manager's Goals</SectionTitle>
            <TextInput
              value={managerNotes}
              onChangeText={setManagerNotes}
              placeholder="Notes from your supervisor..."
              placeholderTextColor={colors.muted}
              multiline
              style={{
                minHeight: 100,
                backgroundColor: "#0e0e0e",
                color: colors.fg,
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                textAlignVertical: "top",
              }}
            />
          </Card>
        </View>
      </View>
    </Screen>
  );
}

function StatTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.box,
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Text style={{ color: colors.muted, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: accent ? colors.accent : colors.fg, fontSize: 20, fontWeight: "800", marginTop: 4 }}>
        {value}
      </Text>
    </View>
  );
}
