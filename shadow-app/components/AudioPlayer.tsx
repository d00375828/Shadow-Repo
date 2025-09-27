import { Audio } from "expo-av";
import React, { useEffect, useState } from "react";
import { Pressable, Text } from "react-native";

export default function AudioPlayer({ uri, bg = "#4cff00", fg = "#000" }: { uri: string; bg?: string; fg?: string }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  async function toggle() {
    try {
      if (!sound) {
        const { sound: s } = await Audio.Sound.createAsync({ uri });
        setSound(s);
        await s.playAsync();
        setPlaying(true);
        s.setOnPlaybackStatusUpdate((st: any) => {
          if (st.didJustFinish) {
            setPlaying(false);
            s.unloadAsync();
            setSound(null);
          }
        });
      } else {
        const st: any = await sound.getStatusAsync();
        if (st.isPlaying) {
          await sound.pauseAsync();
          setPlaying(false);
        } else {
          await sound.playAsync();
          setPlaying(true);
        }
      }
    } catch {
      // no-op
    }
  }

  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);

  return (
    <Pressable
      onPress={toggle}
      style={{ alignSelf: "center", backgroundColor: bg, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
    >
      <Text style={{ color: fg, fontWeight: "800" }}>{playing ? "Pause" : "Play"} Audio</Text>
    </Pressable>
  );
}
