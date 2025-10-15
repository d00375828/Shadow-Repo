// app/(tabs)/home.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import AudioPlayer from "../../components/AudioPlayer";
import PageHeader from "../../components/PageHeader";
import Screen from "../../components/Screen";
import SendToServer from "../../components/SendToServer";
import { useApp, useTheme } from "../../context/AppContext";
import { useRecorder } from "../../hooks/useRecorder";

export default function Home() {
  const { colors } = useTheme();
  const { addRecording } = useApp();

  const { isRecording, uri, seconds, pulse, start, stop, reset } =
    useRecorder();
  const timerOpacity = useRef(new Animated.Value(isRecording ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(timerOpacity, {
      toValue: isRecording ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isRecording, timerOpacity]);

  const [showReview, setShowReview] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [notes, setNotes] = useState("");

  const clock = useMemo(() => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [seconds]);

  async function onRecordPress() {
    try {
      if (!isRecording) {
        await start();
      } else {
        await stop();
        setShowReview(true);
      }
    } catch (e: any) {
      Alert.alert("Recording error", e?.message ?? String(e));
    }
  }

  async function onSave() {
    if (!uri) return Alert.alert("No audio", "Record something first.");
    try {
      await addRecording({
        transcript: transcript.trim(),
        notes: notes.trim(),
        uri,
        createdAt: Date.now(),
      });
      setShowReview(false);
      setTranscript("");
      setNotes("");
      reset();
      Alert.alert("Saved", "You can view your grade in history");
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? String(e));
    }
  }

  function onDelete() {
    Alert.alert("Delete recording?", "This will delete the recording forever", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setShowReview(false);
          setTranscript("");
          setNotes("");
          reset();
        },
      },
    ]);
  }

  return (
    <Screen scroll={false} style={{ padding: 16, backgroundColor: colors.bg }}>
      {/* Header */}
      <PageHeader title="" />
      {/* Record Button */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.View
          style={{
            transform: [{ scale: pulse }],
            borderRadius: 9999,
            padding: 6,
            backgroundColor: isRecording ? "#ff4d4d20" : "transparent",
          }}
        >
          <Pressable
            onPress={onRecordPress}
            style={{
              height: 140,
              width: 140,
              borderRadius: 9999,
              backgroundColor: isRecording ? "#ff4d4d" : colors.accent,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 12,
            }}
          >
            <Ionicons
              name={isRecording ? "stop" : "mic"}
              size={36}
              color={isRecording ? "#000" : colors.onAccent}
            />
          </Pressable>
        </Animated.View>

        {/* Timer */}
        <View style={{ alignItems: "center", marginTop: 12 }}>
          <Text
            style={{ color: colors.muted, fontSize: 16, fontWeight: "700" }}
          >
            {isRecording ? "Recording" : "Ready"}
          </Text>
          <Animated.Text
            style={{
              opacity: timerOpacity,
              color: colors.muted,
              fontSize: 16,
              marginTop: 2,
            }}
          >
            {clock}
          </Animated.Text>
        </View>

        {/* View Recordings Button */}
        <Pressable
          onPress={() => router.push("/recording")}
          style={{
            marginTop: 30,
            alignSelf: "stretch",
            backgroundColor: colors.box,
            borderColor: colors.border,
            borderWidth: 1,
            paddingVertical: 14,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={"videocam-outline"} size={20} color={colors.fg} />
          <Text
            style={{
              color: colors.fg,
              fontWeight: "800",
              fontSize: 16,
              marginLeft: 8,
            }}
          >
            View Recordings
          </Text>
        </Pressable>
      </View>

      {/* Review modal */}
      <Modal
        visible={showReview}
        animationType="slide"
        onRequestClose={() => setShowReview(false)}
      >
        <Screen style={{ backgroundColor: colors.bg }}>
          <KeyboardAvoidingView
            behavior={Platform.select({ ios: "padding", android: undefined })}
            style={{ flex: 1 }}
          >
            <View style={{ padding: 16, gap: 16, flex: 1 }}>
              {/* Top bar */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    color: colors.fg,
                    fontSize: 25,
                    fontWeight: "800",
                    textAlign: "center",
                    flex: 1,
                    paddingBottom: 4,
                  }}
                >
                  Recording Review
                </Text>
              </View>

              {/* Player */}
              {uri ? (
                <View style={{ alignItems: "center" }}>
                  <AudioPlayer
                    uri={uri}
                    bg={colors.accent}
                    fg={colors.onAccent}
                  />
                </View>
              ) : (
                <Text style={{ color: colors.muted }}>No audio found.</Text>
              )}

              {/* Notes / transcript */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.fg,
                    fontWeight: "700",
                    marginBottom: 8,
                  }}
                >
                  Transcript
                </Text>
                <TextInput
                  multiline
                  value={transcript}
                  onChangeText={setTranscript}
                  placeholder="This is where your transcript will appear."
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
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.fg,
                    fontWeight: "700",
                    marginBottom: 8,
                  }}
                >
                  Notes
                </Text>
                <TextInput
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="What went well? What to improve?"
                  placeholderTextColor={colors.muted}
                  style={{
                    color: colors.fg,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 12,
                    minHeight: 100,
                    textAlignVertical: "top",
                  }}
                />
              </View>

              {/* Server Feedback */}
              {uri ? (
                <View>
                  <Text
                    style={{
                      color: colors.fg,
                      fontWeight: "700",
                      marginBottom: 8,
                    }}
                  >
                    Server Feedback
                  </Text>
                  <SendToServer
                    key={uri || "none"}
                    uri={uri}
                    onResponseText={(t) => setTranscript(t)}
                  />
                </View>
              ) : null}

              {/* Action bar */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 12,
                  justifyContent: "space-between",
                }}
              >
                <ActionButton
                  title="Delete"
                  onPress={onDelete}
                  color="#111"
                  fg="#fff"
                />
                <ActionButton
                  title="Save"
                  onPress={onSave}
                  color={colors.accent}
                  fg={colors.onAccent}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </Screen>
      </Modal>
    </Screen>
  );
}

/* ---------- Small internal button ---------- */
function ActionButton({
  title,
  onPress,
  color,
  fg,
  style,
}: {
  title: string;
  onPress: () => void;
  color: string;
  fg: string;
  style?: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          backgroundColor: color,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          alignItems: "center",
        },
        style,
      ]}
    >
      <Text style={{ color: fg, fontWeight: "800" }}>{title}</Text>
    </Pressable>
  );
}
