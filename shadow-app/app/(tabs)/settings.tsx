import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, TextInput, View } from "react-native";
import AppButton from "../../components/AppButton";
import Card from "../../components/Card";
import Screen from "../../components/Screen";
import SectionTitle from "../../components/SectionTitle";
import { useApp, useTheme } from "../../context/AppContext";

export default function Settings() {
  const { colors, isDark, toggleTheme } = useTheme() as any;
  const { profile, setProfile } = useApp();
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role || "Member");
  const [org, setOrg] = useState(profile.org || "");
  const [avatarUri, setAvatarUri] = useState<string | undefined>(profile.avatarUri);

  async function pickAvatar() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!res.canceled && res.assets?.[0]?.uri) setAvatarUri(res.assets[0].uri);
  }

  function save() {
    setProfile({ name, role, org, avatarUri });
  }

  return (
    <Screen backgroundColor={colors.bg} style={{ padding: 16 }}>
      <Card bg={colors.box}>
        <SectionTitle color={colors.fg}>Profile</SectionTitle>

        <View style={{ alignItems: "center", marginBottom: 12 }}>
          <AppButton title={avatarUri ? "Change Photo" : "Add Photo"} onPress={pickAvatar} color={"#222"} fg={colors.muted} />
          {avatarUri ? <Image source={{ uri: avatarUri }} style={{ width: 96, height: 96, borderRadius: 48, marginTop: 8 }} /> : null}
        </View>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor={colors.muted}
          style={{ backgroundColor: "#111", color: colors.fg, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#222", marginBottom: 8 }}
        />

        <View style={{ backgroundColor: "#111", borderRadius: 10, borderWidth: 1, borderColor: "#222", marginBottom: 8 }}>
          <Picker selectedValue={role} onValueChange={(v) => setRole(String(v))} dropdownIconColor={colors.fg} style={{ color: colors.fg }}>
            <Picker.Item label="Member" value="Member" />
            <Picker.Item label="Sales" value="Sales" />
            <Picker.Item label="Support" value="Support" />
            <Picker.Item label="Interviewing" value="Interviewing" />
            <Picker.Item label="Manager" value="Manager" />
          </Picker>
        </View>

        <TextInput
          value={org}
          onChangeText={setOrg}
          placeholder="Organization"
          placeholderTextColor={colors.muted}
          style={{ backgroundColor: "#111", color: colors.fg, borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#222" }}
        />

        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <AppButton title="Save" onPress={save} color={colors.accent} fg={colors.onAccent} />
          <AppButton title={isDark ? "Light Mode" : "Dark Mode"} onPress={toggleTheme} color={"#333"} fg={colors.fg} />
        </View>
      </Card>
    </Screen>
  );
}
