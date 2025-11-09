import { AudioMode } from "expo-audio";

export const RECORDING_AUDIO_MODE: Partial<AudioMode> = {
  allowsRecording: true,
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: "doNotMix",
  interruptionModeAndroid: "doNotMix",
  shouldRouteThroughEarpiece: false,
};

export const IDLE_AUDIO_MODE: Partial<AudioMode> = {
  allowsRecording: false,
  playsInSilentMode: true,
  shouldPlayInBackground: false,
  interruptionMode: "mixWithOthers",
  interruptionModeAndroid: "duckOthers",
  shouldRouteThroughEarpiece: false,
};
