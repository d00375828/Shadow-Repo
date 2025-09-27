// Recording Page
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Animated, Pressable, Text, TextInput, View } from "react-native";
import AppButton from "../../components/AppButton";
import AudioPlayer from "../../components/AudioPlayer";
import SafeModal from "../../components/SafeModal";
import Screen from "../../components/Screen";
import { useApp, useTheme } from "../../context/AppContext";
import { useRecorder } from "../../hooks/useRecorder";

export default function Home() {
  const { colors } = useTheme();
  const { addRecording } = useApp();

  const { isRecording, uri, seconds, pulse, start, stop, reset } = useRecorder();
  const [showReview, setShowReview] = useState(false);
  const [transcript, setTranscript] = useState("");

  async function onSubmit() {
    await addRecording({ transcript, uri, createdAt: Date.now() });
    setShowReview(false);
    setTranscript("");
    reset();
    router.push("/(tabs)/grading");
  }

  return (
    <Screen backgroundColor={colors.bg}>
      {/* Centered Button, dot, timer */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 14 }}>
        <Pressable
          onPress={
            isRecording
              ? async () => {
                  await stop();
                  if (!transcript) setTranscript("[Audio Transcript will go here once it is generated.]");
                  setShowReview(true);
                }
              : start
          }
          style={({ pressed }) => ({
            width: 160,
            height: 160,
            borderRadius: 999,
            backgroundColor: isRecording ? "#a00" : colors.accent,
            opacity: pressed ? 0.9 : 1,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 6,
            borderColor: colors.border,
            shadowColor: "#000",
            shadowOpacity: 0.35,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          })}
        >
          <Ionicons name={isRecording ? "mic" : "mic-outline"} size={36} color={isRecording ? "#fff" : colors.onAccent} style={{ marginBottom: 6 }} />
          <Text style={{ color: isRecording ? "#fff" : colors.onAccent, fontWeight: "900", fontSize: 16 }}>{isRecording ? "STOP" : "RECORD"}</Text>
        </Pressable>

        {isRecording ? (
          <Animated.View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#a00", transform: [{ scale: pulse }] }} />
        ) : null}

        <Text style={{ color: colors.fg, fontSize: 18 }}>
          {isRecording
            ? `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`
            : "Tap to record"}
        </Text>
      </View>

      {/* Review Modal */}
      <SafeModal visible={showReview} animationType="slide" onRequestClose={() => setShowReview(false)} backgroundColor={colors.bg}>
        <Text style={{ color: colors.fg, fontSize: 18, fontWeight: "700", textAlign: "center", marginBottom: 12 }}>Review Recording</Text>
        {uri ? <AudioPlayer uri={uri} bg={colors.accent} fg={colors.onAccent} /> : null}

        <TextInput
          value={transcript}
          onChangeText={setTranscript}
          placeholder="Edit transcript..."
          placeholderTextColor={colors.muted}
          multiline
          style={{ flex: 1, color: colors.fg, backgroundColor: colors.box, borderRadius: 12, padding: 12, textAlignVertical: "top", marginTop: 8 }}
        />

        <View style={{ flexDirection: "row", gap: 12, marginTop: 12, justifyContent: "center" }}>
          <AppButton title="Edit" onPress={() => setShowReview(false)} color={colors.box} fg={colors.fg} />
          <AppButton title="Submit" onPress={onSubmit} color={colors.accent} fg={colors.onAccent} />
          <AppButton
            title="Delete"
            onPress={() => {
              setShowReview(false);
              setTranscript("");
              reset();
            }}
            color={"#400"}
            fg={"#fff"}
          />
        </View>
      </SafeModal>
    </Screen>
  );
}
