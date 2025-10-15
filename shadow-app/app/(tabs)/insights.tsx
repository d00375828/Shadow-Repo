// app/(tabs)/insights.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Switch, Text, View, useWindowDimensions } from "react-native";

import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import RadarChart from "../../components/RadarChart";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";
import { useApp, useTheme } from "../../context/AppContext";

export default function Insights() {
  const { colors } = useTheme();
  const { history, avgScore } = useApp();
  const { width } = useWindowDimensions();

  // ----- Overall Pitch Grade (avg) -----
  const { avg, count } = useMemo(() => {
    const count = Array.isArray(history) ? history.length : 0;
    const fromContext =
      Number.isFinite(avgScore) && !Number.isNaN(avgScore)
        ? Number(avgScore)
        : null;
    if (fromContext != null) return { avg: fromContext, count };
    if (!count) return { avg: NaN, count };
    const sum = history.reduce((s: number, r: any) => s + (r?.score ?? 0), 0);
    return { avg: sum / count, count };
  }, [avgScore, history]);

  const avgText =
    Number.isFinite(avg) && !Number.isNaN(avg) ? `${Math.round(avg)}` : "—";

  // ----- Radar data (current vs prior snapshot) -----
  const chartSize = Math.min(width - 64, 340);
  const labels = [
    "Open",
    "Value",
    "Objections",
    "Technique",
    "Listen",
    "Personality",
    "Tone",
    "Confidence",
    "Script",
  ];

  // Current snapshot (0..1)
  const youValues = [0.76, 0.68, 0.55, 0.71, 0.82, 0.64, 0.7, 0.75, 0.6];
  // Prior snapshot (0..1) – used to compute trends
  const prevYouValues = [0.7, 0.66, 0.6, 0.67, 0.8, 0.62, 0.69, 0.73, 0.62];

  // Team average (static example)
  const teamValues = [0.62, 0.65, 0.58, 0.66, 0.74, 0.59, 0.63, 0.67, 0.58];

  // Toggle overlay
  const [compareTeam, setCompareTeam] = useState(false);

  const pct = (v: number) => `${Math.round(v * 100)}%`;
  const deltaPts = (curr: number, prev: number) =>
    Math.round((curr - prev) * 100);

  // ----- Trends (Improving / Consistent / Watch) -----
  const trends = useMemo(() => {
    const deltas = youValues.map((v, i) => v - (prevYouValues[i] ?? v));
    // Improving: largest positive delta
    let improvingIdx = -1;
    let improvingDelta = -Infinity;
    deltas.forEach((d, i) => {
      if (d > improvingDelta) {
        improvingDelta = d;
        improvingIdx = i;
      }
    });

    // Watch: largest negative delta
    let watchIdx = -1;
    let watchDelta = Infinity;
    deltas.forEach((d, i) => {
      if (d < watchDelta) {
        watchDelta = d;
        watchIdx = i;
      }
    });

    // Consistent: high score, low change
    const consistent = labels
      .map((lab, i) => ({
        lab,
        score: youValues[i],
        delta: deltas[i],
        absDeltaPts: Math.abs(
          deltaPts(youValues[i], prevYouValues[i] ?? youValues[i])
        ),
      }))
      .filter((x) => x.score >= 0.75 && x.absDeltaPts <= 3) // ≥75% and ≤3 pts change
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return {
      improving:
        improvingIdx >= 0
          ? {
              lab: labels[improvingIdx],
              curr: youValues[improvingIdx],
              prev: prevYouValues[improvingIdx] ?? youValues[improvingIdx],
            }
          : null,
      consistent,
      watch:
        watchIdx >= 0
          ? {
              lab: labels[watchIdx],
              curr: youValues[watchIdx],
              prev: prevYouValues[watchIdx] ?? youValues[watchIdx],
            }
          : null,
    };
  }, [labels, youValues, prevYouValues]);

  const Pill = ({ text, bg, fg }: { text: string; bg: string; fg: string }) => (
    <Text
      style={{
        color: fg,
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
        fontWeight: "800",
        fontSize: 12,
      }}
    >
      {text}
    </Text>
  );

  const Row = ({
    icon,
    title,
    subtitle,
    pill,
    iconColor,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    pill?: React.ReactNode;
    iconColor: string;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Ionicons name={icon} size={18} color={iconColor} />
        <View style={{ gap: 2 }}>
          <Text style={{ color: colors.fg, fontWeight: "700" }}>{title}</Text>
          {subtitle ? (
            <Text style={{ color: colors.muted, fontSize: 12 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
      {pill}
    </View>
  );

  return (
    <Screen style={{ padding: 16, backgroundColor: colors.bg }}>
      <PageHeader title="Performance" />

      {/* ----- Box 1: Overall Pitch Grade ----- */}
      <Card
        bg={colors.box}
        style={{
          gap: 10,
          borderColor: colors.border,
          borderWidth: 1,
          alignItems: "center",
          paddingVertical: 16,
        }}
      >
        <View style={{ alignItems: "center", width: "100%" }}>
          <SectionTitle color={colors.fg}>Overall Pitch Grade</SectionTitle>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Text
            style={{ color: colors.accent, fontSize: 48, fontWeight: "900" }}
          >
            {avgText}
          </Text>
          {avgText !== "—" ? (
            <Text style={{ color: colors.fg, fontSize: 30, fontWeight: "700" }}>
              %
            </Text>
          ) : null}
        </View>

        <Text style={{ color: colors.muted, textAlign: "center" }}>
          {count
            ? `Based on ${count} recording${count === 1 ? "" : "s"}.`
            : "No recordings yet."}
        </Text>
      </Card>

      <View style={{ height: 16 }} />

      {/* ----- Box 2: Sales Personality ----- */}
      <Card
        bg={colors.box}
        style={{
          gap: 8,
          borderColor: colors.border,
          borderWidth: 1,
          alignItems: "center",
          paddingVertical: 16,
        }}
      >
        <SectionTitle color={colors.fg}>Sales Personality</SectionTitle>
        <Text
          style={{
            color: colors.fg,
            fontSize: 18,
            fontWeight: "800",
            textAlign: "center",
            paddingTop: 4,
          }}
        >
          The Consultant
        </Text>
        <Text
          style={{ color: colors.muted, lineHeight: 20, textAlign: "center" }}
        >
          Builds rapport, asks open-ended questions, and tailors recommendations
          to the buyer’s stated pains. Emphasizes discovery, summarizes needs,
          and proposes clear next steps.
        </Text>
      </Card>

      <View style={{ height: 16 }} />

      {/* ----- Box 3: Sales Profile (Radar + Breakdown + Toggle) ----- */}
      <Card
        bg={colors.box}
        style={{
          gap: 12,
          borderColor: colors.border,
          borderWidth: 1,
          alignItems: "center",
          paddingVertical: 16,
        }}
      >
        <SectionTitle color={colors.fg}>Your Performance</SectionTitle>

        {/* Toggle row */}
        <View
          style={{
            width: "100%",
            paddingHorizontal: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: -4,
          }}
        >
          <Text style={{ color: colors.muted }}>Compare to Team</Text>
          <Switch
            value={compareTeam}
            onValueChange={setCompareTeam}
            trackColor={{ false: colors.border, true: "#314d25" }}
            thumbColor={compareTeam ? colors.accent : "#777"}
          />
        </View>

        {/* Centered Radar */}
        <View style={{ width: "100%", alignItems: "center" }}>
          {compareTeam ? (
            <RadarChart
              size={chartSize}
              labels={labels}
              series={[
                {
                  name: "You",
                  values: youValues,
                  stroke: colors.accent,
                  fill: "rgba(76,255,0,0.18)",
                },
                {
                  name: "Team Avg",
                  values: teamValues,
                  stroke: "#6ba5ff",
                  fill: "rgba(107,165,255,0.18)",
                },
              ]}
              levels={5}
              gridColor={colors.border}
              labelColor={colors.muted}
              showLegend
              showPoints={false}
              showValueLabels={false}
              showRingPercents={false}
            />
          ) : (
            <RadarChart
              size={chartSize}
              labels={labels}
              values={youValues}
              levels={5}
              gridColor={colors.border}
              labelColor={colors.muted}
              showLegend={false}
              showPoints={false}
              showValueLabels={false}
              showRingPercents={false}
            />
          )}
        </View>

        {/* Divider */}
        <View
          style={{ height: 1, backgroundColor: colors.border, width: "100%" }}
        />

        {/* Breakdown list (You) */}
        <View style={{ width: "100%" }}>
          {labels.map((lab, i) => {
            const youPct = Math.round(youValues[i] * 100);
            const barColor =
              youPct >= 80
                ? colors.accent
                : youPct >= 60
                ? "#9BE870"
                : youPct >= 40
                ? "#E5C94D"
                : "#E86A6A";
            return (
              <View
                key={lab + i}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: colors.border,
                  borderRadius: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: colors.muted, fontSize: 14 }}>
                    {lab}
                  </Text>
                  <Text
                    style={{
                      color: colors.onAccent,
                      backgroundColor: barColor,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 9999,
                      fontWeight: "800",
                      fontSize: 12,
                    }}
                  >
                    {youPct}%
                  </Text>
                </View>
                <View
                  style={{
                    height: 8,
                    borderRadius: 9999,
                    backgroundColor: colors.border,
                    marginTop: 10,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${youPct}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </Card>

      <View style={{ height: 16 }} />

      {/* ----- Box 4: Recent Trends ----- */}
      <Card
        bg={colors.box}
        style={{
          gap: 8,
          borderColor: colors.border,
          borderWidth: 1,
          paddingVertical: 16,
          paddingHorizontal: 12,
        }}
      >
        <SectionTitle color={colors.fg}>Recent Trends</SectionTitle>

        {/* Improving */}
        <Row
          icon="trending-up"
          title={
            trends.improving
              ? `Improving — ${trends.improving.lab}`
              : "Improving — —"
          }
          subtitle={
            trends.improving
              ? `${pct(trends.improving.prev)} → ${pct(trends.improving.curr)}`
              : "No clear improvement yet"
          }
          iconColor={colors.accent}
          pill={
            trends.improving ? (
              <Pill
                text={`${deltaPts(
                  trends.improving.curr,
                  trends.improving.prev
                )}%`}
                bg={colors.accent}
                fg={colors.onAccent}
              />
            ) : undefined
          }
        />

        {/* Consistent */}
        <Row
          icon="remove-outline"
          title="Consistent"
          subtitle={
            trends.consistent.length
              ? trends.consistent.map((x) => x.lab).join(" • ")
              : "—"
          }
          iconColor="#E5C94D"
          pill={
            trends.consistent.length ? (
              <Pill
                text={trends.consistent.map((x) => pct(x.score)).join("  ")}
                bg="#3a341c"
                fg="#E5C94D"
              />
            ) : undefined
          }
        />

        {/* Watch */}
        <Row
          icon="trending-down"
          title={trends.watch ? `Watch — ${trends.watch.lab}` : "Watch - -"}
          subtitle={
            trends.watch
              ? `${pct(trends.watch.prev)} → ${pct(trends.watch.curr)}`
              : "No major declines"
          }
          iconColor="#E86A6A"
          pill={
            trends.watch ? (
              <Pill
                text={`${deltaPts(trends.watch.curr, trends.watch.prev)}%`}
                bg="#3b1f21"
                fg="#E86A6A"
              />
            ) : undefined
          }
        />
      </Card>
    </Screen>
  );
}
