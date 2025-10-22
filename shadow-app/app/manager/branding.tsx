import BackButton from "@/components/BackButton";
import { useTheme } from "@/context";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import AppButton from "../../components/AppButton";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Screen from "../../components/Screen";

export default function Branding() {
  const { colors } = useTheme();
  const [accent, setAccent] = useState("#2563EB");
  const [bg, setBg] = useState("#0B0F17");
  const [onAccent, setOnAccent] = useState("#FFFFFF");

  return (
    <Screen backgroundColor={colors.bg} style={{ padding: 16 }}>
      <PageHeader title="Branding" left={<BackButton />} />
      <Card bg={colors.box} border={colors.border} style={{ gap: 16 }}>
        <Field label="Accent" value={accent} onChangeText={setAccent} />
        <Field label="Background" value={bg} onChangeText={setBg} />
        <Field label="On Accent" value={onAccent} onChangeText={setOnAccent} />

        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.fg, fontWeight: "700" }}>Preview</Text>
          <View
            style={{
              backgroundColor: bg,
              padding: 12,
              borderRadius: 12,
              gap: 8,
            }}
          >
            <View
              style={{ backgroundColor: accent, padding: 12, borderRadius: 10 }}
            >
              <Text style={{ color: onAccent, fontWeight: "800" }}>
                Primary Button
              </Text>
            </View>
            <Text style={{ color: "#fff" }}>Text on background</Text>
          </View>
        </View>

        <AppButton
          title="Save Theme"
          onPress={() => {
            // TODO: POST /org/settings/theme { accent, bg, onAccent }
          }}
          color={colors.accent}
          fg={colors.onAccent}
        />
      </Card>
    </Screen>
  );
}

function Field({
  label,
  ...props
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: colors.fg, fontWeight: "700" }}>{label}</Text>
      <TextInput
        {...props}
        placeholder="#RRGGBB"
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          color: colors.fg,
          padding: 12,
          borderRadius: 10,
        }}
      />
    </View>
  );
}
