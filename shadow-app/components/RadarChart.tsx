// Used to make the attributes chart in the Insights screen
import React, { useEffect, useMemo, useRef } from "react";
import { Animated } from "react-native";
import Svg, {
  Circle,
  G,
  Line,
  Polygon,
  Rect,
  Text as SvgText,
  TSpan,
} from "react-native-svg";

type Series = {
  values: number[];
  name?: string;
  stroke?: string;
  fill?: string;
  pointFill?: string;
};

type Props = {
  size?: number;
  levels?: number;
  labels: string[];
  values?: number[]; // individual results
  series?: Series[]; // for comparing to team
  // grid / axis
  gridColor?: string;
  gridDash?: readonly number[];
  axisCapRadius?: number;
  // axis labels
  labelColor?: string;
  labelFontSize?: number;
  labelRadius?: number;
  outerMargin?: number; // extra canvas space around the chart
  labelWrap?: boolean; // enable word-wrapping
  labelMaxCharsPerLine?: number; // wrap width heuristic
  labelMaxLines?: number; // cap lines
  labelLineHeight?: number;
  // ring percent labels
  showRingPercents?: boolean;
  ringLabelColor?: string;
  ringLabelAxis?: "top" | "right" | "bottom" | "left";
  // points + value labels
  showPoints?: boolean;
  pointRadius?: number;
  pointStroke?: string;
  pointStrokeWidth?: number;
  showValueLabels?: boolean;
  valueLabelColor?: string;
  valueLabelFontSize?: number;
  // animation
  animate?: boolean;
  animationDuration?: number;
  // legend
  showLegend?: boolean;
  legendTextColor?: string;
};

export default function RadarChart({
  size = 280,
  levels = 4,
  labels,
  values,
  series,
  gridColor = "#333",
  gridDash = [1, 5],
  axisCapRadius = 2.5,
  labelColor = "#aaa",
  labelFontSize = 11,
  labelRadius = 0.88,
  showRingPercents = true,
  ringLabelColor = "#6e6e6e",
  ringLabelAxis = "top",
  showPoints = false,
  pointRadius = 5,
  pointStroke = "#000",
  pointStrokeWidth = 1.6,
  showValueLabels = false,
  valueLabelColor = "#ddd",
  valueLabelFontSize = 11,
  animate = true,
  animationDuration = 300,
  showLegend = true,
  legendTextColor = "#bbb",
  // NEW:
  outerMargin = 24,
  labelWrap = true,
  labelMaxCharsPerLine = 10,
  labelMaxLines = 2,
  labelLineHeight = Math.round(1.25 * 11), // ~1.25 * default font
}: Props) {
  const palette = ["#4cff00", "#6ba5ff", "#ffb74d", "#e57373", "#b39ddb"];
  const seriesData: Series[] = useMemo(() => {
    if (series?.length) return series;
    if (values && values.length) {
      return [
        {
          values,
          name: "You",
          stroke: palette[0],
          fill: "rgba(76,255,0,0.18)",
          pointFill: palette[0],
        },
      ];
    }
    return [];
  }, [values, series]);

  const n = labels.length;
  if (!n || n < 3 || seriesData.some((s) => s.values.length !== n)) return null;

  // Canvas is larger than the radar "size" to allow label overflow without clipping
  const canvasSize = size + outerMargin * 2;
  const cx = canvasSize / 2;
  const cy = canvasSize / 2;
  const padding = 20;
  const R = size / 2 - padding;

  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n; // axis 0 points UP
  const pointAt = (ratio: number, i: number) => {
    const r = R * Math.max(0, Math.min(1, ratio));
    const a = angle(i);
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a), a };
  };

  // axis indices for ring % labels
  const ringAxisIndex = useMemo(() => {
    if (ringLabelAxis === "top") return 0; // up
    if (ringLabelAxis === "right") return Math.round(n / 4) % n;
    if (ringLabelAxis === "bottom") return Math.round(n / 2) % n;
    if (ringLabelAxis === "left") return Math.round((3 * n) / 4) % n;
    return 0;
  }, [n, ringLabelAxis]);

  const axisEnds = useMemo(() => labels.map((_, i) => pointAt(1, i)), [labels]);

  // animation
  const scale = useRef(new Animated.Value(animate ? 0.9 : 1)).current;
  useEffect(() => {
    if (!animate) return;
    Animated.timing(scale, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();
  }, [animate, animationDuration, scale]);
  const AnimatedG = Animated.createAnimatedComponent(G);

  const seriesPolys = seriesData.map((s, si) => {
    const pts = s.values.map((v, i) => pointAt(v, i));
    const path = pts.map((p) => `${p.x},${p.y}`).join(" ");
    return { s, pts, path, color: s.stroke ?? palette[si % palette.length] };
  });

  // --- Simple word wrap helper for SVG labels ---
  function wrapWords(
    text: string,
    maxChars: number,
    maxLines: number
  ): string[] {
    const words = (text || "").split(/\s+/);
    const lines: string[] = [];
    let line = "";

    for (const w of words) {
      const trial = line ? `${line} ${w}` : w;
      if (trial.length <= maxChars) {
        line = trial;
      } else {
        if (line) lines.push(line);
        line = w;
        if (lines.length >= maxLines - 1) break;
      }
    }
    if (line && lines.length < maxLines) lines.push(line);

    // Ellipsize if truncated
    const joined = lines.join(" ");
    if ((text || "").length > joined.length && lines.length) {
      const last = lines[lines.length - 1];
      lines[lines.length - 1] =
        last.length > 1
          ? last.replace(/\.*$/, "").slice(0, Math.max(1, last.length - 1)) +
            "…"
          : "…";
    }
    return lines;
  }

  return (
    <Svg width={canvasSize} height={canvasSize}>
      {/* grid rings */}
      {Array.from({ length: levels }, (_, li) => {
        const r = (R * (li + 1)) / levels;
        return (
          <Circle
            key={`ring-${li}`}
            cx={cx}
            cy={cy}
            r={r}
            stroke={gridColor}
            strokeWidth={1}
            strokeDasharray={gridDash as any}
            fill="none"
          />
        );
      })}

      {/* axes + caps */}
      {axisEnds.map((p, i) => (
        <G key={`axis-${i}`}>
          <Line
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke={gridColor}
            strokeWidth={1}
          />
          <Circle cx={p.x} cy={p.y} r={axisCapRadius} fill={gridColor} />
        </G>
      ))}

      {/* ring % labels along chosen axis — with values increasing OUTWARD */}
      {showRingPercents &&
        Array.from({ length: levels }, (_, li) => {
          const ratio = (li + 1) / levels; // 25, 50, 75, 100 for levels=4
          const pr = pointAt(ratio, ringAxisIndex);
          const pct = Math.round(ratio * 100);
          const lx = pr.x; // centered on axis
          const ly = pr.y - 6; // nudge upward a hair
          return (
            <SvgText
              key={`rl-${li}`}
              x={lx}
              y={ly}
              fill={ringLabelColor}
              fontSize={10}
              alignmentBaseline="bottom"
              textAnchor="middle"
            >
              {pct}%
            </SvgText>
          );
        })}

      {/* axis labels (wrapped & kept inside rim) */}
      {labels.map((lab, i) => {
        const a = angle(i);
        const lp = pointAt(labelRadius, i);
        const cos = Math.cos(a);
        const sin = Math.sin(a);

        const anchor = cos > 0.15 ? "start" : cos < -0.15 ? "end" : "middle";
        const dx = cos > 0 ? 4 : cos < 0 ? -4 : 0;
        const dyBase = sin > 0 ? 2 : sin < 0 ? -2 : 0;

        const lines = labelWrap
          ? wrapWords(lab, labelMaxCharsPerLine, labelMaxLines)
          : [lab];

        return (
          <SvgText
            key={`lab-${i}`}
            x={lp.x + dx}
            y={lp.y + dyBase}
            fill={labelColor}
            fontSize={labelFontSize}
            alignmentBaseline="middle"
            textAnchor={anchor as any}
          >
            {lines.map((ln, idx) => (
              <TSpan
                key={idx}
                x={lp.x + dx}
                dy={idx === 0 ? 0 : labelLineHeight}
              >
                {ln}
              </TSpan>
            ))}
          </SvgText>
        );
      })}

      {/* data (animated scale-in) */}
      <AnimatedG
        originX={cx}
        originY={cy} // @ts-ignore
        style={{ transform: [{ scale }] }}
      >
        {seriesPolys.map(({ s, pts, path, color }, idx) => (
          <G key={`poly-${idx}`}>
            <Polygon
              points={path}
              fill={s.fill ?? "rgba(255,255,255,0.08)"}
              stroke="transparent"
            />
            <Polygon
              points={path}
              fill={s.fill ?? "rgba(255,255,255,0.08)"}
              stroke={color}
              strokeWidth={2}
            />

            {/* Dots & value labels are optional; defaults are OFF */}
            {showPoints &&
              pts.map((p, i) => (
                <Circle
                  key={`pt-${idx}-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r={pointRadius}
                  fill={s.pointFill ?? color}
                  stroke={pointStroke}
                  strokeWidth={pointStrokeWidth}
                />
              ))}

            {showValueLabels &&
              pts.map((p, i) => (
                <SvgText
                  key={`vl-${idx}-${i}`}
                  x={p.x + Math.cos(p.a) * 10}
                  y={p.y + Math.sin(p.a) * 10}
                  fill={valueLabelColor}
                  fontSize={valueLabelFontSize}
                  alignmentBaseline="middle"
                  textAnchor={
                    Math.cos(p.a) > 0.15
                      ? "start"
                      : Math.cos(p.a) < -0.15
                      ? "end"
                      : "middle"
                  }
                >
                  {Math.round(seriesPolys[idx].s.values[i] * 100)}%
                </SvgText>
              ))}
          </G>
        ))}
      </AnimatedG>

      {/* legend (only if multiple series) */}
      {showLegend && seriesPolys.length > 1 && (
        <G>
          <Rect
            x={outerMargin}
            y={canvasSize - outerMargin - 22}
            width={canvasSize - outerMargin * 2}
            height={18}
            rx={6}
            fill="rgba(255,255,255,0.03)"
          />
          {seriesPolys.map(({ s, color }, i) => (
            <G
              key={`leg-${i}`}
              transform={`translate(${outerMargin + 8 + i * 110}, ${
                canvasSize - outerMargin - 13
              })`}
            >
              <Rect
                x={0}
                y={-6}
                width={12}
                height={12}
                rx={2}
                fill={s.fill ?? "transparent"}
                stroke={color}
              />
              <SvgText
                x={18}
                y={0}
                fill={legendTextColor}
                fontSize={11}
                alignmentBaseline="middle"
              >
                {s.name ?? `Series ${i + 1}`}
              </SvgText>
            </G>
          ))}
        </G>
      )}
    </Svg>
  );
}
