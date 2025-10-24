"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Text } from "react-native";
import {
  Page,
  Card,
  H1,
  Row,
  Label,
  Input,
  Button,
  GhostButton,
} from "../(auth)/_ui";
import { getUsers, setAuthed } from "../(auth)/auth";

export default function LoginPage() {
  const r = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    const users = getUsers();
    const match = users.find((u) => u.username === username);
    if (!match) return setError("No account found. Create one below.");
    if (match.password !== password) return setError("Incorrect password.");
    setAuthed(username);
    r.push("/home");
  }

  return (
    <Page>
      <Card>
        <H1 />
        <form onSubmit={onLogin}>
          <Row>
            <Label>Username</Label>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
            />
          </Row>
          <Row>
            <Label>Password</Label>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
            />
          </Row>
          {error && (
            <Text style={{ color: "#ffb4b4", marginTop: 6 }}>{error}</Text>
          )}
          <Button title="Log in" onPressAction={() => onLogin()} />
          <GhostButton
            title="Create account"
            onPressAction={() => r.push("/create")}
          />
        </form>
      </Card>
    </Page>
  );
}
