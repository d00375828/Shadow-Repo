// components/SendToServer.tsx
import { AUDIO_ENDPOINT } from "@/lib/api";
import { GradeResult, normalizeServerGrade } from "@/lib/audio/grade";
import * as FileSystem from "expo-file-system/legacy";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

type Props = {
  uri: string | null;
  buttonLabel?: string;
  onResponseText?: (text: string) => void; // updates Transcript input
  onAiReport?: (result: GradeResult) => void; // returns normalized report
  colors?: {
    accent: string;
    onAccent: string;
    box: string;
    fg: string;
    muted: string;
    border: string;
  };
  /** Hide the pretty-printed server response box (keeps button + spinner) */
  showResponse?: boolean;
  /** Hide the error box (errors still logged to console) */
  showError?: boolean;
};

function isM4A(u: string) {
  const lower = u.split("?")[0].toLowerCase();
  return lower.endsWith(".m4a");
}

export default function SendToServer({
  uri,
  buttonLabel = "Grade",
  onResponseText,
  onAiReport,
  colors = {
    accent: "#4F46E5",
    onAccent: "#FFFFFF",
    box: "#0F172A10",
    fg: "#0F172A",
    muted: "#475569",
    border: "#CBD5E1",
  },
  showResponse = true,
  showError = true,
}: Props) {
  const [sending, setSending] = useState(false);
  const [serverText, setServerText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadBinaryNative(fileUri: string) {
    // Resolve the BINARY enum value safely across SDK variants:
    const BINARY =
      (FileSystem as any)?.FileSystemUploadType?.BINARY_CONTENT ?? 0;

    const res = await FileSystem.uploadAsync(AUDIO_ENDPOINT, fileUri, {
      httpMethod: "POST",
      headers: {
        "Content-Type": "audio/m4a",
        Accept: "application/json, text/plain, */*",
      },
      uploadType: BINARY as number,
    });

    return { status: res.status, body: res.body };
  }

  async function uploadBinaryWeb(fileUri: string) {
    const resp = await fetch(fileUri);
    const blob = await resp.blob();
    const r = await fetch(AUDIO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "audio/m4a",
        Accept: "application/json, text/plain, */*",
      },
      body: blob,
    });
    const body = await r.text();
    return { status: r.status, body };
  }

  async function handleSend() {
    if (!uri) return;

    // Optional guard: server only accepts .m4a
    if (!isM4A(uri)) {
      Alert.alert(
        "Unsupported file",
        "This server only accepts .m4a audio files. Please re-record and try again."
      );
      return;
    }

    setSending(true);
    setError(null);
    setServerText(null);

    try {
      const { status, body } =
        Platform.OS === "web"
          ? await uploadBinaryWeb(uri)
          : await uploadBinaryNative(uri);

      if (!(status >= 200 && status < 300)) {
        throw new Error(`Upload failed (${status}): ${body}`);
      }

      // Pretty print & normalize
      let pretty = body;
      try {
        const data = JSON.parse(body);
        pretty = JSON.stringify(data, null, 2);

        const normalized = normalizeServerGrade(data);
        onResponseText?.(normalized.transcript); // fill transcript box from dialogue
        onAiReport?.(normalized); // bubble full AI report to Home
      } catch {
        // non-JSON; show raw
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

      {/* Spinner stays visible while sending */}
      {sending && <ActivityIndicator />}

      {/* Conditionally show response box */}
      {showResponse && serverText ? (
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
              fontFamily:
                Platform.OS === "ios"
                  ? "Menlo"
                  : Platform.OS === "android"
                  ? "monospace"
                  : undefined,
            }}
          >
            {serverText}
          </Text>
        </View>
      ) : null}

      {/* Conditionally show error box */}
      {showError && error ? (
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
