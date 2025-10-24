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
import { getUsers, saveUsers } from "../(auth)/auth";

export default function CreatePage() {
  const r = useRouter();
  const [username, setUsername] = useState("");
  const [organizationCode, setOrganizationCode] = useState(""); // ✅ NEW
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  function onCreate(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setOk(null);

    if (!username || !password || !organizationCode) {
      return setError(
        "Please fill in all fields, including your Organization code."
      );
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    const users = getUsers();
    if (users.some((u) => u.username === username)) {
      return setError("Username already exists.");
    }

    users.push({ username, password, organizationCode }); // ✅ store it
    saveUsers(users);
    setOk("Account created! You can log in now.");
  }

  return (
    <Page>
      <Card>
        <H1 />
        <form onSubmit={onCreate}>
          <Row>
            <Label>Create a username</Label>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="••••••••"
            />
          </Row>

          <Row>
            <Label>Create a password</Label>
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />
          </Row>

          <Row>
            <Label>Confirm password</Label>
            <Input
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholder="••••••••"
            />
          </Row>
          <Row>
            <Label>Organization code</Label>
            <Input
              value={organizationCode}
              onChangeText={setOrganizationCode}
              placeholder="Enter your org code"
              autoCapitalize="none"
            />
          </Row>

          {error && (
            <Text style={{ color: "#ffb4b4", marginTop: 6 }}>{error}</Text>
          )}
          {ok && <Text style={{ color: "#a8ffb4", marginTop: 6 }}>{ok}</Text>}

          <Button title="Create account" onPressAction={() => onCreate()} />
          <GhostButton
            title="Back to login"
            onPressAction={() => r.push("/login")}
          />
        </form>
      </Card>
    </Page>
  );
}
