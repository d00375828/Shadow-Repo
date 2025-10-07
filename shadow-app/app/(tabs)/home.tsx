// app/(tabs)/home.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
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
import SendToServer from "../../components/SendToServer"; // ← if not added yet, comment this line
import { useApp, useTheme } from "../../context/AppContext";
import { useRecorder } from "../../hooks/useRecorder";

export default function Home() {
  const { colors } = useTheme();
  const { addRecording } = useApp();

  // useRecorder centralizes permission, audio-mode, record start/stop, uri, timer, and pulse animation
  const { isRecording, uri, seconds, pulse, start, stop, reset } =
    useRecorder();

  // local UI state
  const [showReview, setShowReview] = useState(false);
  const [transcript, setTranscript] = useState("");

  // format mm:ss
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
        // When stop completes, hook sets uri
        setShowReview(true);
      }
    } catch (e: any) {
      Alert.alert("Recording error", e?.message ?? String(e));
    }
  }

  async function onSave() {
    if (!uri) {
      Alert.alert("No audio", "Record something first.");
      return;
    }
    try {
      await addRecording({
        transcript: transcript.trim(),
        uri,
        createdAt: Date.now(),
      });
      setShowReview(false);
      setTranscript("");
      reset(); // clears uri + timer + recording flag
      Alert.alert("Saved", "Your recording was added to History.");
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? String(e));
    }
  }

  function onDiscard() {
    Alert.alert(
      "Discard recording?",
      "This will remove the current audio and text.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            setShowReview(false);
            setTranscript("");
            reset();
          },
        },
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
      {/* Header */}
      <Text
        style={{
          color: colors.fg,
          fontSize: 24,
          fontWeight: "800",
          marginBottom: 16,
        }}
      >
        Shadow Sales — Practice
      </Text>

      {/* Big round record button with pulse */}
      <View style={{ alignItems: "center", marginTop: 32 }}>
        <Animated.View
          style={{
            transform: [{ scale: pulse }], // comes from the hook
            borderRadius: 9999,
            padding: 6,
            backgroundColor: isRecording ? "#ff4d4d20" : "transparent",
          }}
        >
          <Pressable
            onPress={onRecordPress}
            style={{
              height: 96,
              width: 96,
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
        <Text style={{ color: colors.muted, marginTop: 12, fontSize: 16 }}>
          {isRecording ? "Recording" : "Ready"} • {clock}
        </Text>

        {/* Show “Review” if a URI exists but modal is closed */}
        {uri && !showReview ? (
          <Pressable
            onPress={() => setShowReview(true)}
            style={{
              marginTop: 12,
              backgroundColor: colors.box,
              borderColor: colors.border,
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: colors.fg, fontWeight: "700" }}>
              Open Review
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Review modal: playback, notes, send-to-server, save/discard */}
      <Modal
        visible={showReview}
        animationType="slide"
        onRequestClose={() => setShowReview(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: "padding", android: undefined })}
          style={{ flex: 1, backgroundColor: colors.bg }}
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
                style={{ color: colors.fg, fontSize: 20, fontWeight: "800" }}
              >
                Review
              </Text>
              <Pressable
                onPress={() => setShowReview(false)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  backgroundColor: colors.box,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Text style={{ color: colors.fg, fontWeight: "700" }}>
                  Close
                </Text>
              </Pressable>
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
                style={{ color: colors.fg, fontWeight: "700", marginBottom: 8 }}
              >
                Notes / Transcript
              </Text>
              <TextInput
                multiline
                value={transcript}
                onChangeText={setTranscript}
                placeholder="What went well? What to improve?"
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

            {/* Send to server (optional, comment out if component not present) */}
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
                  uri={uri}
                  onResponseText={(t) => setTranscript(t)} // ← add this
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
                title="Discard"
                onPress={onDiscard}
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
      </Modal>
    </View>
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
