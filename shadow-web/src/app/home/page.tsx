// app/home/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text, View, StyleSheet } from "react-native";
import { Page, Card, H1, GhostButton } from "../(auth)/_ui";
import { getAuthed, signOut } from "../(auth)/auth";
import { theme } from "../../lib/theme";

export default function HomePage() {
  const r = useRouter();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const a = getAuthed();
    if (!a) r.replace("/login");
    else setUsername(a.username);
  }, [r]);

  return (
    <Page>
      <Card>
        <H1 />
        <Text style={s.headline}>
          Congrats you made it{username ? `, ${username}` : ""}!
        </Text>

        <View style={s.rule} />

        <GhostButton
          title="Go to Uploads"
          onPressAction={() => r.push("/upload")}
        />
        <GhostButton
          title="Sign out"
          onPressAction={() => {
            signOut();
            r.replace("/login");
          }}
        />
      </Card>
    </Page>
  );
}

const c = theme.colors;
const s = StyleSheet.create({
  headline: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 8,
    color: c.fg,
  },
  rule: {
    height: 1,
    backgroundColor: c.border,
    marginVertical: 12,
    opacity: 0.8,
  },
});
