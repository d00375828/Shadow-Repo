import React from "react";
import { AuthProvider } from "./auth";
import { ProfileProvider } from "./profile";
import { RecordingsProvider } from "./recordings";
import { NotificationsProvider } from "./settings/notifications";
import { PrivacyProvider } from "./settings/privacy";
import { ThemeProvider } from "./theme";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <NotificationsProvider>
            <PrivacyProvider>
              <RecordingsProvider>{children}</RecordingsProvider>
            </PrivacyProvider>
          </NotificationsProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
