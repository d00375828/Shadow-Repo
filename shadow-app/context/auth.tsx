import React, { createContext, useContext, useEffect, useState } from "react";
import { KEYS, getStr, setStr } from "./storage";

const Ctx = createContext<{
  isAuthed: boolean;
  signIn: (u: string) => Promise<void>;
  signOut: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = useState(true); // default authed for current flows

  useEffect(() => {
    (async () => setIsAuthed((await getStr(KEYS.isAuthed, "1")) === "1"))();
  }, []);
  useEffect(() => {
    setStr(KEYS.isAuthed, isAuthed ? "1" : "0");
  }, [isAuthed]);

  async function signIn(_username: string) {
    setIsAuthed(true);
  }
  async function signOut() {
    setIsAuthed(false);
  }
  return (
    <Ctx.Provider value={{ isAuthed, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
