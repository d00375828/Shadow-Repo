// app/(tabs)/settings.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import PageHeader from "@/components/PageHeader";
import { useAuth, useTheme } from "@/context";
import Card from "../../components/Card";
import SafeModal from "../../components/SafeModal";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";

const LEADING_ICON_SIZE = 26;
const CHEVRON_ICON_SIZE = 22;

function NavCard({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ marginBottom: 12 }}>
      <Card
        bg={colors.box}
        style={{
          borderColor: colors.border,
          borderWidth: 1,
          paddingVertical: 14,
          paddingHorizontal: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Ionicons
            name={icon}
            size={LEADING_ICON_SIZE}
            color={colors.accent}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.fg, fontWeight: "800", fontSize: 16 }}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={{ color: colors.muted, marginTop: 2 }}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <Ionicons
            name="chevron-forward"
            size={CHEVRON_ICON_SIZE}
            color={colors.accent}
          />
        </View>
      </Card>
    </Pressable>
  );
}

export default function SettingsHub() {
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const [showHelp, setShowHelp] = useState(false);

  function doSignOut() {
    Alert.alert("Sign out?", "You’ll need to sign in again to continue.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut();
        },
      },
    ]);
  }

  return (
    // NOTE: flexGrow: 1 lets the content fill the height so the footer can sit at the bottom
    <Screen style={{ padding: 16, backgroundColor: colors.bg, flexGrow: 1 }}>
      <PageHeader title="Settings" />

      <NavCard
        title="Profile"
        subtitle="Manage your account info"
        icon="person-circle-outline"
        onPress={() => router.push("/settings/profile")}
      />

      <NavCard
        title="Notifications"
        subtitle="Manage your alerts"
        icon="notifications-outline"
        onPress={() => router.push("/settings/notifications")}
      />

      <NavCard
        title="Privacy & Security"
        subtitle="Permissions and access"
        icon="shield-checkmark-outline"
        onPress={() => router.push("/settings/privacy")}
      />

      <NavCard
        title="Help & Support"
        subtitle="Contact info and FAQs"
        icon="help-circle-outline"
        onPress={() => setShowHelp(true)}
      />

      {/* Spacer pushes the footer button to the bottom */}
      <View style={{ flexGrow: 1 }} />

      {/* Footer: Sign Out at bottom */}
      <Pressable
        onPress={doSignOut}
        style={{
          backgroundColor: "#B00020",
          paddingVertical: 12,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Sign Out</Text>
      </Pressable>

      {/* Help Modal */}
      <SafeModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        title="Help & Support"
      >
        <View style={{ gap: 12 }}>
          <SectionTitle color={colors.fg}>Contact Information</SectionTitle>
          <Text style={{ color: colors.muted }}>Email: support@shadow.com</Text>
          <Text style={{ color: colors.muted }}>Phone: 1-800-SHADOW1</Text>
          <Text style={{ color: colors.muted }}>Hours: 24/7 Support</Text>

          <SectionTitle color={colors.fg} style={{ marginTop: 8 }}>
            Frequently Asked Questions
          </SectionTitle>
          <Text style={{ color: colors.fg, fontWeight: "700" }}>
            How do I reset my password?
          </Text>
          <Text style={{ color: colors.muted, marginBottom: 8 }}>
            Contact your organization administrator.
          </Text>
          <Text style={{ color: colors.fg, fontWeight: "700" }}>
            What if I forgot my organization code?
          </Text>
          <Text style={{ color: colors.muted }}>
            Check with your manager or HR department.
          </Text>
        </View>
      </SafeModal>
    </Screen>
  );
}
