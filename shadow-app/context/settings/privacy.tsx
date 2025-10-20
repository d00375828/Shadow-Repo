import React, { createContext, useContext, useEffect, useState } from "react";
import { KEYS, getJson, setJson } from "../storage";
import { PrivacyPrefs } from "../types";

const DEFAULT: PrivacyPrefs = {
  activeListening: false,
  analytics: false,
  location: false,
  microphone: false,
  access: [
    { name: "Avery Morgan", role: "Manager", relation: "manager" },
    { name: "Jordan Lee", role: "Owner", relation: "owner" },
  ],
};

const Ctx = createContext<{
  privacyPrefs: PrivacyPrefs;
  setPrivacyPrefs: (p: PrivacyPrefs) => void;
} | null>(null);

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [privacyPrefs, setPrivacyPrefs] = useState<PrivacyPrefs>(DEFAULT);

  useEffect(() => {
    (async () => setPrivacyPrefs(await getJson(KEYS.privacyPrefs, DEFAULT)))();
  }, []);
  useEffect(() => {
    setJson(KEYS.privacyPrefs, privacyPrefs);
  }, [privacyPrefs]);

  return (
    <Ctx.Provider value={{ privacyPrefs, setPrivacyPrefs }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePrivacy() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePrivacy must be used within PrivacyProvider");
  return v;
}
