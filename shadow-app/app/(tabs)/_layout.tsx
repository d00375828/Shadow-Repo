import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useApp, useTheme } from "../../context/AppContext";

export default function TabsLayout() {
  const { isAuthed } = useApp();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed) router.replace("/");
  }, [isAuthed, router]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#0b0b0b", borderTopColor: "#1b1b1b" },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Record",
          tabBarIcon: ({ color, size }) => <Ionicons name="mic" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="training"
        options={{
          title: "Training",
          tabBarIcon: ({ color, size }) => <Ionicons name="trending-up" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="grading"
        options={{
          title: "Grading",
          tabBarIcon: ({ color, size }) => <Ionicons name="ribbon" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
