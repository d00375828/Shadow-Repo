// components/AudioPlayer.tsx
import React, { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";
import { useAudioPlayer } from "expo-audio";

export default function AudioPlayer({
  uri,
  bg = "#4cff00",
  fg = "#000",
}: {
  uri: string;
  bg?: string;
  fg?: string;
}) {
  // Simple player from expo-audio
  const player = useAudioPlayer(uri);
  const [playing, setPlaying] = useState(false);

  async function toggle() {
    try {
      if (playing) {
        await player.pause();
        setPlaying(false);
      } else {
        await player.play();
        setPlaying(true);
      }
    } catch {
      // no-op
    }
  }

  // Reset button state whenever the source changes
  useEffect(() => {
    setPlaying(false);
  }, [uri]);

  return (
    <Pressable
      onPress={toggle}
      style={{
        alignSelf: "center",
        backgroundColor: bg,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
      }}
    >
      <Text style={{ color: fg, fontWeight: "800" }}>
        {playing ? "Pause" : "Play"} Audio
      </Text>
    </Pressable>
  );
}
