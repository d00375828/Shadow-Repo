import React, { createContext, useContext, useEffect, useState } from "react";
import { KEYS, getJson, setJson } from "../storage";
import { NotifPrefs } from "../types";

const Ctx = createContext<{
  notifPrefs: NotifPrefs;
  setNotifPrefs: (n: NotifPrefs) => void;
} | null>(null);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    push: false,
    email: false,
    sms: false,
  });

  useEffect(() => {
    (async () =>
      setNotifPrefs(
        await getJson(KEYS.notifPrefs, {
          push: false,
          email: false,
          sms: false,
        })
      ))();
  }, []);
  useEffect(() => {
    setJson(KEYS.notifPrefs, notifPrefs);
  }, [notifPrefs]);

  return (
    <Ctx.Provider value={{ notifPrefs, setNotifPrefs }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNotifications() {
  const v = useContext(Ctx);
  if (!v)
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  return v;
}
