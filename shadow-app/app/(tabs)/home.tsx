// app/(tabs)/home.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useApp, useTheme } from "../../context/AppContext";
import useIsLandscape from "../../hooks/useIsLandscape";
import {
  useAudioRecorder,
  RecordingPresets,
  setAudioModeAsync,
  AudioModule,
  useAudioPlayer,
} from "expo-audio";

export default function Home() {
  const { colors } = useTheme();
  const { addRecording } = useApp();
  const isLandscape = useIsLandscape();

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [transcript, setTranscript] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [uri, setUri] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulsing dot animation
  const pulse = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isRecording) {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.4,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      loopRef.current.start();
    } else {
      loopRef.current?.stop();
      loopRef.current = null;
      pulse.setValue(1);
    }
    return () => {
      loopRef.current?.stop();
      loopRef.current = null;
    };
  }, [isRecording, pulse]);

  // Permissions + audio mode
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Microphone permission is required to record.");
        return;
      }
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  function startTimer() {
    setSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }
  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  async function start() {
    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
      startTimer();
    } catch (e: any) {
      Alert.alert("Start error", String(e?.message ?? e));
    }
  }

  async function stop() {
    try {
      if (!isRecording) return;
      await recorder.stop();
      setIsRecording(false);
      stopTimer();
      const u = recorder.uri ?? null;
      setUri(u);
      if (!transcript) setTranscript("[Auto transcript placeholder.]");
      setShowReview(true);
    } catch (e: any) {
      Alert.alert("Stop error", String(e?.message ?? e));
    }
  }

  async function handleSubmit() {
    await addRecording({ transcript, uri, createdAt: Date.now() });
    setShowReview(false);
    setTranscript("");
    setUri(null);
    router.push("/(tabs)/grading");
  }

  function confirmDelete() {
    Alert.alert(
      "Delete recording?",
      "This will discard audio and transcript.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setShowReview(false);
            setTranscript("");
            setUri(null);
          },
        },
      ]
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingHorizontal: isLandscape ? 24 : 16,
        paddingVertical: isLandscape ? 10 : 24,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: isLandscape ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: isLandscape ? 32 : 16,
        }}
      >
        {/* Button + dot + timer */}
        <View style={{ alignItems: "center", gap: 14 }}>
          <Pressable
            onPress={isRecording ? stop : start}
            style={({ pressed }) => ({
              width: isLandscape ? 180 : 160,
              height: isLandscape ? 180 : 160,
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
            <Ionicons
              name={isRecording ? "mic" : "mic-outline"}
              size={isLandscape ? 42 : 36}
              color={isRecording ? "#fff" : colors.onAccent}
              style={{ marginBottom: 6 }}
            />
            <Text
              style={{
                color: isRecording ? "#fff" : colors.onAccent,
                fontWeight: "900",
                fontSize: 16,
              }}
            >
              {isRecording ? "STOP" : "RECORD"}
            </Text>
          </Pressable>

          {isRecording ? (
            <Animated.View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#a00",
                transform: [{ scale: pulse as unknown as number } as any],
              }}
            />
          ) : null}

          <Text style={{ color: colors.fg, fontSize: 18 }}>
            {isRecording
              ? `${Math.floor(seconds / 60)
                  .toString()
                  .padStart(2, "0")}:${(seconds % 60)
                  .toString()
                  .padStart(2, "0")}`
              : "Tap to record"}
          </Text>
        </View>

        {isLandscape ? (
          <View
            style={{ width: 1, height: 160, backgroundColor: colors.border }}
          />
        ) : null}
      </View>

      {/* Review Recording */}
      <ReviewModal
        visible={showReview}
        onClose={() => setShowReview(false)}
        colors={colors}
        isLandscape={isLandscape}
        transcript={transcript}
        setTranscript={setTranscript}
        uri={uri}
        onSubmit={handleSubmit}
        onDelete={confirmDelete}
      />
    </View>
  );
}

function ReviewModal(props: {
  visible: boolean;
  onClose: () => void;
  colors: any;
  isLandscape: boolean;
  transcript: string;
  setTranscript: (t: string) => void;
  uri: string | null;
  onSubmit: () => void;
  onDelete: () => void;
}) {
  const {
    visible,
    onClose,
    colors,
    isLandscape,
    transcript,
    setTranscript,
    uri,
    onSubmit,
    onDelete,
  } = props;
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      {/* We pad manually with insets to guarantee it clears the Dynamic Island & home indicator */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 8,
          paddingLeft: isLandscape ? 24 : 16,
          paddingRight: isLandscape ? 24 : 16,
        }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <Text
            style={{
              color: colors.fg,
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Review Recording
          </Text>

          <View style={{ alignItems: "center", marginBottom: 8 }}>
            {uri ? <AudioPlayer uri={uri} color={colors} /> : null}
          </View>

          <TextInput
            value={transcript}
            onChangeText={setTranscript}
            placeholder="Edit transcript..."
            placeholderTextColor={colors.muted}
            multiline
            style={{
              flex: 1,
              color: colors.fg,
              backgroundColor: colors.box,
              borderRadius: 12,
              padding: 12,
              textAlignVertical: "top",
              marginTop: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginTop: 12,
              justifyContent: "center",
            }}
          >
            <Pressable
              onPress={onSubmit}
              style={{
                backgroundColor: colors.accent,
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: colors.onAccent, fontWeight: "700" }}>
                Submit
              </Text>
            </Pressable>
            <Pressable
              onPress={onDelete}
              style={{ backgroundColor: "#400", padding: 12, borderRadius: 10 }}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function AudioPlayer({ uri, color }: { uri: string; color: any }) {
  const player = useAudioPlayer(uri);
  const [playing, setPlaying] = useState(false);

  async function toggle() {
    try {
      if (!playing) {
        await player.play();
        setPlaying(true);
      } else {
        await player.pause();
        setPlaying(false);
      }
    } catch {}
  }

  useEffect(() => {
    setPlaying(false);
  }, [uri]);

  return (
    <Pressable
      onPress={toggle}
      style={{
        alignSelf: "center",
        backgroundColor: color.accent,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: color.onAccent, fontWeight: "800" }}>
        {playing ? "Pause" : "Play"} Audio
      </Text>
    </Pressable>
  );
}
