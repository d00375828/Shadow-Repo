"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Text } from "react-native";
import { Page, Card, H1, GhostButton } from "../(auth)/_ui";
import { getAuthed, signOut } from "../(auth)/auth";

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
        <Text style={{ textAlign: "center", fontSize: 18, marginTop: 8 }}>
          Congrats you made it{username ? `, ${username}` : ""}!
        </Text>
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
