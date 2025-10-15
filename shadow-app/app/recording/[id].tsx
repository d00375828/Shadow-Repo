// app/recording/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from "react-native";

import AudioPlayer from "../../components/AudioPlayer";
import Card from "../../components/Card";
import PageHeader from "../../components/PageHeader";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";
import { useApp, useTheme } from "../../context/AppContext";

export default function RecordingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { history, deleteRecording, updateRecordingNotes } = useApp();

  const rec = useMemo(() => {
    const key = String(id);
    return (history || []).find(
      (h: any) => String(h.id) === key || String(h.createdAt) === key
    );
  }, [id, history]);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesDraft, setNotesDraft] = useState(rec?.notes ?? "");

  if (!rec) {
    return (
      <Screen
        scroll={false}
        backgroundColor={colors.bg}
        style={{ padding: 16 }}
      >
        <PageHeader
          title="Recording Details"
          left={
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={{
                padding: 6,
                borderRadius: 9999,
                backgroundColor: colors.box,
                borderColor: colors.border,
                borderWidth: 1,
              }}
            >
              <Ionicons name="chevron-back" size={20} color={colors.fg} />
            </Pressable>
          }
        />
        <Card bg={colors.box} style={{ gap: 12 }}>
          <Text style={{ color: colors.fg, fontSize: 18, fontWeight: "800" }}>
            Recording not found
          </Text>
          <Text style={{ color: colors.muted }}>
            This item may have been removed or hasn’t been saved yet.
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: "#333",
            }}
          >
            <Text style={{ color: colors.fg }}>Go Back</Text>
          </Pressable>
        </Card>
      </Screen>
    );
  }

  const r = rec as any;

  async function shareDetails() {
    const text = `SHADOW Report

Date: ${new Date(r.createdAt).toLocaleString()}
${typeof r.score === "number" ? `Score: ${r.score}/100\n\n` : ""}Transcript:
${(r.transcript || "").trim() || "(none)"}

Notes:
${(r.notes || "").trim() || "(none)"}
`;
    await Share.share({ message: text });
  }

  function confirmDelete() {
    Alert.alert(
      "Delete recording?",
      "This will permanently remove the audio file (if present), transcript, and notes.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const key = String(id);
            deleteRecording(key);
            router.replace("/recording");
          },
        },
      ]
    );
  }

  function startEditingNotes() {
    setNotesDraft(r.notes ?? "");
    setIsEditingNotes(true);
  }

  function cancelEditingNotes() {
    setNotesDraft(r.notes ?? "");
    setIsEditingNotes(false);
  }

  function saveNotes() {
    const key = String(id);
    updateRecordingNotes(key, notesDraft);
    setIsEditingNotes(false);
  }

  return (
    <Screen scroll={false} backgroundColor={colors.bg} style={{ padding: 16 }}>
      <PageHeader
        title="Recording Details"
        left={
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{
              padding: 6,
              borderRadius: 9999,
              backgroundColor: colors.box,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.fg} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
        {/* Meta + Player */}
        <Card bg={colors.box} style={{ gap: 10 }}>
          <Text style={{ color: colors.muted }}>
            {new Date(r.createdAt).toLocaleString()}
          </Text>

          {typeof r.score === "number" ? (
            <Text style={{ color: colors.fg, fontSize: 16 }}>
              Score:{" "}
              <Text style={{ color: colors.accent, fontWeight: "800" }}>
                {r.score}/100
              </Text>
            </Text>
          ) : null}

          {!!r.audioUri && (
            <View style={{ marginTop: 8 }}>
              <AudioPlayer
                uri={r.audioUri}
                bg={colors.accent}
                fg={colors.onAccent}
              />
            </View>
          )}
        </Card>

        {/* Transcript */}
        <Card bg={colors.box} style={{ gap: 8 }}>
          <SectionTitle color={colors.fg}>Transcript</SectionTitle>
          <Text style={{ color: colors.muted, lineHeight: 20 }}>
            {r.transcript?.trim() || "(No transcript saved)"}
          </Text>
        </Card>

        {/* Notes */}
        <Card bg={colors.box} style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <SectionTitle color={colors.fg}>Notes</SectionTitle>

            {!isEditingNotes ? (
              <Pressable
                onPress={startEditingNotes}
                hitSlop={8}
                style={{
                  padding: 6,
                  borderRadius: 9999,
                  backgroundColor: colors.box,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Ionicons name="create-outline" size={18} color={colors.fg} />
              </Pressable>
            ) : (
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Pressable
                  onPress={saveNotes}
                  hitSlop={8}
                  style={{
                    padding: 6,
                    borderRadius: 9999,
                    backgroundColor: colors.accent,
                  }}
                >
                  <Ionicons
                    name="checkmark"
                    size={18}
                    color={colors.onAccent}
                  />
                </Pressable>
                <Pressable
                  onPress={cancelEditingNotes}
                  hitSlop={8}
                  style={{
                    padding: 6,
                    borderRadius: 9999,
                    backgroundColor: "#333",
                  }}
                >
                  <Ionicons name="close" size={18} color={colors.fg} />
                </Pressable>
              </View>
            )}
          </View>

          {!isEditingNotes ? (
            <Text style={{ color: colors.muted, lineHeight: 20 }}>
              {r.notes?.trim() || "(No notes saved)"}
            </Text>
          ) : (
            <TextInput
              multiline
              autoFocus
              value={notesDraft}
              onChangeText={setNotesDraft}
              placeholder="Add or update your notes…"
              placeholderTextColor={colors.muted}
              style={{
                color: colors.fg,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 10,
                padding: 12,
                minHeight: 120,
                textAlignVertical: "top",
              }}
            />
          )}
        </Card>

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: 8 }}>
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

          <Pressable
            onPress={confirmDelete}
            style={{
              backgroundColor: "#B00020",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Delete</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}
