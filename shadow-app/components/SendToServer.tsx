// components/SendToServer.tsx
import { AUDIO_ENDPOINT } from "@/lib/api";
import { uploadAudioFile } from "@/lib/network/uploadAudio";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

type Props = {
  uri: string | null;
  buttonLabel?: string;
  onResponseText?: (text: string) => void; // we'll pass the transcription up
  colors?: {
    accent: string;
    onAccent: string;
    box: string;
    fg: string;
    muted: string;
    border: string;
  };
};

export default function SendToServer({
  uri,
  buttonLabel = "Send to Server",
  onResponseText,
  colors = {
    accent: "#4F46E5",
    onAccent: "#FFFFFF",
    box: "#0F172A10",
    fg: "#0F172A",
    muted: "#475569",
    border: "#CBD5E1",
  },
}: Props) {
  const [sending, setSending] = useState(false);
  const [serverText, setServerText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!uri) return;
    setSending(true);
    setError(null);
    setServerText(null);
    try {
      const text = await uploadAudioFile(uri, AUDIO_ENDPOINT);

      // Try to parse JSON; if it fails, just show raw text
      let pretty = text;
      try {
        const data = JSON.parse(text);
        // pretty-print JSON for the UI
        pretty = JSON.stringify(data, null, 2);

        // If the server returns a transcription string, bubble it up to the notes box
        const t =
          typeof data?.transcription === "string"
            ? data.transcription
            : typeof data?.text === "string"
            ? data.text
            : null;
        if (t) onResponseText?.(t);
      } catch {
        // leave as raw text
      }

      setServerText(pretty);
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      setError(msg);
      console.log("UPLOAD ERROR:", msg);
    } finally {
      setSending(false);
    }
  }

  const disabled = !uri || sending;

  return (
    <View style={{ gap: 10 }}>
      <Pressable
        onPress={handleSend}
        disabled={disabled}
        style={{
          backgroundColor: colors.accent,
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 10,
          opacity: disabled ? 0.6 : 1,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.onAccent, fontWeight: "800" }}>
          {sending ? "Sending..." : buttonLabel}
        </Text>
      </Pressable>

      {sending && <ActivityIndicator />}

      {serverText ? (
        <View
          style={{
            backgroundColor: colors.box,
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{ color: colors.fg, fontWeight: "700", marginBottom: 6 }}
          >
            Server Response
          </Text>
          <Text
            style={{
              color: colors.muted,
              fontFamily: Platform.select({
                ios: "Menlo",
                android: "monospace",
                default: undefined,
              }),
            }}
          >
            {serverText}
          </Text>
        </View>
      ) : null}

      {error ? (
        <View
          style={{
            backgroundColor: "#FEE2E2",
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#FCA5A5",
          }}
        >
          <Text
            style={{ color: "#991B1B", fontWeight: "700", marginBottom: 6 }}
          >
            Upload Error
          </Text>
          <Text style={{ color: "#7F1D1D" }}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}
