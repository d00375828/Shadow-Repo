// hooks/useRecorder.ts
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated } from "react-native";

export function useRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const [uri, setUri] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [prepared, setPrepared] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Breath pulse animation state
  const pulse = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  // Permissions + audio mode + eager prepare (once)
  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Microphone permission is required to record.");
        return;
      }
      await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
      try {
        await recorder.prepareToRecordAsync();
        setPrepared(true);
      } catch {
        // We'll lazily prepare on start() if eager prepare fails.
      }
    })();
    // Cleanup: stop timer & animation if unmounted mid-recording
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      loopRef.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animate while recording (BREATH: subtle in/out)
  useEffect(() => {
    if (isRecording) {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1.0, duration: 800, useNativeDriver: true }),
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

  // Timer helpers
  function startTimer() {
    setSeconds(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  }
  function stopTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }

  // Start/stop with optimistic UI (feels instant)
  async function start() {
    if (isRecording) return;
    setIsRecording(true);     // immediate visual feedback
    startTimer();
    try {
      if (!prepared) {
        await recorder.prepareToRecordAsync();
        setPrepared(true);
      }
      await recorder.record();
    } catch (e: any) {
      // revert on failure
      setIsRecording(false);
      stopTimer();
      Alert.alert("Start error", String(e?.message ?? e));
    }
  }

  async function stop() {
    if (!isRecording) return;
    setIsRecording(false);    // immediate visual feedback
    stopTimer();
    try {
      await recorder.stop();
      setUri(recorder.uri ?? null);
    } catch (e: any) {
      Alert.alert("Stop error", String(e?.message ?? e));
    }
  }

  function reset() {
    setUri(null);
    setSeconds(0);
    setIsRecording(false);
  }

  return { isRecording, uri, seconds, pulse, start, stop, reset };
}
