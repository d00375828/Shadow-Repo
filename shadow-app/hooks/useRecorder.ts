// hooks/useRecorder.ts
import { useEffect, useRef, useState } from "react";
import { Alert, Animated } from "react-native";
import {
  useAudioRecorder,
  RecordingPresets,
  setAudioModeAsync,
  AudioModule,
} from "expo-audio";

export function useRecorder() {
  // expo-audio recorder
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [uri, setUri] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // pulse animation (mirrors your old behavior)
  const pulse = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Permissions
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Microphone permission is required to record.");
      } else {
        // sensible audio mode for recording
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      }
    })();
  }, []);

  // Animate while recording
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
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Microphone permission is required to record.");
        return;
      }
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
      setUri(recorder.uri ?? null);
    } catch (e: any) {
      Alert.alert("Stop error", String(e?.message ?? e));
    }
  }

  return {
    isRecording,
    uri,
    seconds,
    pulse,
    start,
    stop,
    reset: () => {
      setUri(null);
      setSeconds(0);
      setIsRecording(false);
    },
  };
}
