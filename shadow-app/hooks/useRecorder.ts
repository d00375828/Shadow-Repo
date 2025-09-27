import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated } from "react-native";

export function useRecorder() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  const timerRef = useRef<number| null>(null);

  // pulse animation
  const pulse = useRef(new Animated.Value(1)).current;
  const loopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") Alert.alert("Microphone permission is required to record.");
    })();
  }, []);

  useEffect(() => {
    if (recording) {
      loopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.4, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
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
  }, [recording, pulse]);

  function startTimer() {
    setSeconds(0);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000) as unknown as number;
  }
  
  function stopTimer() {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function start() {
    const { status } = await Audio.getPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Microphone permission is required to record.");
      return;
    }
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
    startTimer();
  }

  async function stop() {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const u = recording.getURI();
    setUri(u ?? null);
    setRecording(null);
    stopTimer();
  }

  return {
    isRecording: Boolean(recording),
    uri,
    seconds,
    pulse,
    start,
    stop,
    reset: () => setUri(null),
  };
}
