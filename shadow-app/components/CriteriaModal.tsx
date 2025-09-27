import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { Criteria } from "../context/AppContext";
import { useTheme } from "../context/AppContext";
import SafeModal from "./SafeModal";

type Props = {
  open: boolean;
  onClose: () => void;
  criteria: Criteria;
  onSave: (c: Criteria) => void;
};

export default function CriteriaModal({ open, onClose, criteria, onSave }: Props) {
  const { colors } = useTheme();
  const [local, setLocal] = useState<Criteria>(criteria);
  useEffect(() => { if (open) setLocal(criteria); }, [open, criteria]);

  return (
    <SafeModal visible={open} animationType="slide" onRequestClose={onClose} backgroundColor={colors.bg}>
      <Text style={{ color: colors.fg, fontSize: 18, fontWeight: "800", marginBottom: 12, textAlign: "center" }}>
        Grading Criteria
      </Text>

      {Object.keys(local).map((k) => {
        const key = k as keyof Criteria;
        const active = local[key];
        return (
          <Pressable key={k} onPress={() => setLocal({ ...local, [key]: !active })} style={{ paddingVertical: 10 }}>
            <Text style={{ color: active ? colors.accent : colors.muted }}>
              {active ? "✔ " : "○ "} {labelFor(k)}
            </Text>
          </Pressable>
        );
      })}

      <View style={{ flexDirection: "row", gap: 12, marginTop: 12, justifyContent: "center" }}>
        <Pressable onPress={onClose} style={{ backgroundColor: colors.box, padding: 12, borderRadius: 8 }}>
          <Text style={{ color: colors.fg }}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={() => { onSave(local); onClose(); }}
          style={{ backgroundColor: colors.accent, padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: colors.onAccent, fontWeight: "800" }}>Save</Text>
        </Pressable>
      </View>
    </SafeModal>
  );
}

function labelFor(key: string) {
  switch (key) {
    case "clarity": return "Clarity";
    case "empathy": return "Empathy";
    case "conciseness": return "Conciseness";
    case "objectionHandling": return "Objection Handling";
    case "productKnowledge": return "Product Knowledge";
    default: return key;
  }
}
