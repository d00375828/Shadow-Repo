export { useAuth } from "./auth";
export { useProfile } from "./profile";
export { useRecordings } from "./recordings";
export { RootProvider } from "./RootProvider";
export { useNotifications } from "./settings/notifications";
export { usePrivacy } from "./settings/privacy";
export { useTheme } from "./theme";
export * from "./types";

// ---- Temporary façade exposing ONLY what's used in your screens
import { useAuth } from "./auth";
import { useProfile } from "./profile";
import { useRecordings } from "./recordings";
import { useNotifications } from "./settings/notifications";
import { usePrivacy } from "./settings/privacy";

export function useApp() {
  const { signOut } = useAuth();

  const { profile, setProfile } = useProfile();
  const { notifPrefs, setNotifPrefs } = useNotifications();
  const { privacyPrefs, setPrivacyPrefs } = usePrivacy();

  const {
    criteria,
    updateCriteria,
    history,
    addRecording,
    deleteRecording,
    updateRecordingNotes,
    avgScore,
  } = useRecordings();

  return {
    // recordings + stats you use
    criteria,
    updateCriteria,
    history,
    addRecording,
    deleteRecording,
    updateRecordingNotes,
    avgScore,

    // profile + settings
    profile,
    setProfile,
    notifPrefs,
    setNotifPrefs,
    privacyPrefs,
    setPrivacyPrefs,

    // auth (current screens call signOut)
    signOut,
  };
}
