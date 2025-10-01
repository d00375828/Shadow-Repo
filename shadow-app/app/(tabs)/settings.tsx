// Settings Page

import React, { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "../../components/Card";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";
import { useApp, useTheme } from "../../context/AppContext";
import { router } from "expo-router";
import useIsLandscape from "../../hooks/useIsLandscape";

const ROLES = [
  "Sales Rep",
  "Account Executive",
  "SDR",
  "Manager",
  "Custom",
] as const;

export default function Settings() {
  const { colors } = useTheme();
  const { profile, setProfile, signOut } = useApp();
  const isLandscape = useIsLandscape();
  const { width } = useWindowDimensions();
  const cardWidth = isLandscape
    ? Math.min(560, Math.max(380, width * 0.5))
    : undefined;

  const [roleOpen, setRoleOpen] = useState(false);

  function update<K extends keyof typeof profile>(
    key: K,
    value: (typeof profile)[K]
  ) {
    setProfile({ ...profile, [key]: value });
  }

  async function onLogout() {
    await signOut();
    router.replace("/");
  }

  return (
    <Screen
      backgroundColor={colors.bg}
      style={{ padding: 16, alignItems: "center" }}
    >
      <Card bg={colors.box} style={{ gap: 12, width: cardWidth ?? "100%" }}>
        <SectionTitle color={colors.fg}>Profile</SectionTitle>

        {/* Name */}
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>Name</Text>
          <TextInput
            value={profile.name}
            onChangeText={(t) => update("name", t)}
            placeholder="Your name"
            placeholderTextColor={colors.muted}
            style={{
              backgroundColor: "#0e0e0e",
              color: colors.fg,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />
        </View>

        {/* Organization */}
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>
            Organization
          </Text>
          <TextInput
            value={profile.org}
            onChangeText={(t) => update("org", t)}
            placeholder="Company / Team"
            placeholderTextColor={colors.muted}
            style={{
              backgroundColor: "#0e0e0e",
              color: colors.fg,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          />
        </View>

        {/* Role (modal selector, high-contrast) */}
        <View style={{ gap: 6 }}>
          <Text style={{ color: colors.muted, fontSize: 12 }}>Role</Text>
          <Pressable
            onPress={() => setRoleOpen(true)}
            style={{
              backgroundColor: "#0e0e0e",
              borderColor: colors.border,
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: colors.fg, fontWeight: "600" }}>
              {profile.role || "Select role"}
            </Text>
            <Ionicons name="chevron-down" size={18} color={colors.muted} />
          </Pressable>
        </View>

        {/* Logout */}
        <Pressable
          onPress={onLogout}
          style={{
            backgroundColor: "#300",
            borderWidth: 1,
            borderColor: "#500",
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Log Out</Text>
        </Pressable>
      </Card>

      {/* Role modal */}
      <Modal
        visible={roleOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setRoleOpen(false)}
      >
        <Pressable
          onPress={() => setRoleOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "#000a",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: colors.box,
              borderRadius: 14,
              padding: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text
              style={{
                color: colors.fg,
                fontSize: 16,
                fontWeight: "800",
                textAlign: "center",
                marginVertical: 8,
              }}
            >
              Select Role
            </Text>
            {ROLES.map((r) => {
              const selected = r === profile.role;
              return (
                <Pressable
                  key={r}
                  onPress={() => {
                    update("role", r);
                    setRoleOpen(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: colors.fg, fontSize: 15 }}>{r}</Text>
                  {selected ? (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={colors.accent}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
