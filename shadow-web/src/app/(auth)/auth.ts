"use client";

const USERS_KEY = "shadow.users";
const AUTH_KEY = "shadow.auth";

export type User = { username: string; password: string; organizationCode: string; };

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
export function saveUsers(users: User[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
export function setAuthed(username: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEY, JSON.stringify({ username }));
}
export function getAuthed(): { username: string } | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); } catch { return null; }
}
export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
}
