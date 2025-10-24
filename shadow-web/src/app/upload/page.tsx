// app/upload/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, View, StyleSheet } from "react-native";
import { Page, Card, H1, Button, GhostButton } from "../(auth)/_ui";
import { getAuthed } from "../(auth)/auth";

type PickedFile = { name: string; size: number; type: string; file: File };

// Web-only style for the native <input type="file" />
const fileInputStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 10,
  border: "1px solid #2a3550",
  background: "#0f1322",
  color: "#e6e9ef",
};

export default function UploadPage() {
  const r = useRouter();
  const [files, setFiles] = useState<PickedFile[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const a = getAuthed();
    if (!a) r.replace("/login");
  }, [r]);

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
    }));
    setFiles(picked);
    setMessage(null);
  }

  function formatBytes(n: number) {
    if (n < 1024) return `${n} B`;
    const kb = n / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(2)} MB`;
  }

  async function onUploadAction() {
    if (files.length === 0) {
      setMessage("Pick one or more files first.");
      return;
    }
    // Placeholder for future API call:
    // const fd = new FormData();
    // files.forEach((f) => fd.append("files", f.file, f.name));
    // const res = await fetch("/api/upload", { method: "POST", body: fd });
    // const json = await res.json();

    setMessage(`Ready to upload ${files.length} file(s). (API not wired yet)`);
  }

  return (
    <Page>
      <Card>
        <H1 />
        <Text style={s.title}>Upload files</Text>

        {/* Picker row */}
        <View style={s.pickerRow}>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={onPickFiles}
            // Example accept filters:
            // accept="image/*"
            // accept="audio/*"
            style={fileInputStyle}
          />
          {/* Spacer (since RN Web doesn't support 'gap' in StyleSheet) */}
          <View style={{ height: 10 }} />
          <GhostButton
            title="Clear selection"
            onPressAction={() => {
              setFiles([]);
              setMessage(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
          />
        </View>

        {/* Selected files */}
        {files.length > 0 ? (
          <View style={s.list}>
            {files.map((f, i) => (
              <View key={`${f.name}-${i}`} style={s.item}>
                <Text style={s.itemName}>{f.name}</Text>
                <Text style={s.itemMeta}>
                  {f.type || "unknown"} · {formatBytes(f.size)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={s.hint}>No files selected yet.</Text>
        )}

        {message && <Text style={s.info}>{message}</Text>}

        <Button title="Upload" onPressAction={onUploadAction} />
        <GhostButton
          title="Back to Home"
          onPressAction={() => r.push("/home")}
        />
      </Card>
    </Page>
  );
}

const s = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  pickerRow: { marginBottom: 12 },
  list: { marginTop: 6, marginBottom: 8 },
  item: {
    paddingVertical: 6,
    borderBottomColor: "#232b3d",
    borderBottomWidth: 1,
  },
  itemName: { fontWeight: "600" },
  itemMeta: { opacity: 0.7 },
  hint: { opacity: 0.7, textAlign: "center", marginBottom: 8 },
  info: { marginVertical: 8, color: "#a8ffb4", textAlign: "center" },
});
