import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// ---- Fixed (Dark) Theme ----
const DARK_COLORS = {
  bg: "#000",
  fg: "#fff",
  muted: "#d1d1d1",
  accent: "#4cff00",
  peach: "#ffddba",
  onAccent: "#000",
  box: "#111",
  border: "#1b1b1b",
};

export type Criteria = {
  clarity: boolean;
  empathy: boolean;
  conciseness: boolean;
  objectionHandling: boolean;
  productKnowledge: boolean;
};

export type RecordingInput = {
  transcript: string;
  uri: string | null;
  createdAt: number;
};

export type Grade = {
  id: number;
  createdAt: number;
  score: number;
  positives: string[];
  suggestions: string[];
};

export type TodayGoal = {
  id: number;
  text: string;
  done: boolean;
  createdAt: number;
};

export type PrevGoal = {
  id: number;
  text: string;
  completedAt: number;
};

interface AppState {
  // Auth
  isAuthed: boolean;
  signIn: (username: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Stats
  sessions: number;
  avgScore: number;
  streak: number;
  lastSubmitDate: number | null;

  // Goals (new model)
  goalsToday: TodayGoal[];
  prevGoals: PrevGoal[];
  managerNotes: string;
  addTodayGoal: (text: string) => void;
  toggleTodayGoal: (id: number) => void;        // visual toggle only
  completeTodayGoal: (id: number) => void;      // move to accomplished
  removePrevGoal: (id: number) => void;
  setManagerNotes: (text: string) => void;

  // Legacy (kept)
  goals: string[];
  addGoal: (g: string) => void;
  achievements: { title: string; done: boolean }[];
  toggleAchievement: (i: number) => void;

  // Grading
  criteria: Criteria;
  updateCriteria: (c: Criteria) => void;
  history: (Grade & { audioUri?: string | null })[];
  addRecording: (r: RecordingInput) => Promise<Grade>;

  // Profile
  profile: { name: string; role: string; org: string; avatarUri?: string };
  setProfile: (p: { name: string; role: string; org: string; avatarUri?: string }) => void;
}

const defaultCriteria: Criteria = {
  clarity: true,
  empathy: true,
  conciseness: true,
  objectionHandling: false,
  productKnowledge: false,
};

// Keep the Theme context shape but lock to dark
const ThemeCtx = createContext<{
  colors: typeof DARK_COLORS;
  isDark: true;
  toggleTheme: () => void; // no-op
} | null>(null);

const AppCtx = createContext<AppState | null>(null);

// ---- Helpers ----
const DAY_MS = 24 * 60 * 60 * 1000;
function epochDay(ts: number) {
  // Midnight UTC buckets (switch to local math if you prefer local-day streaks)
  return Math.floor(ts / DAY_MS);
}

// ---- Provider ----
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Auth
  const [isAuthed, setIsAuthed] = useState(false);

  // Stats
  const [sessions, setSessions] = useState(0);
  const [avgScore, setAvgScore] = useState(NaN);
  const [streak, setStreak] = useState(0);
  const [lastSubmitDate, setLastSubmitDate] = useState<number | null>(null);

  // Goals (new)
  const [goalsToday, setGoalsToday] = useState<TodayGoal[]>([]);
  const [prevGoals, setPrevGoals] = useState<PrevGoal[]>([]);
  const [managerNotes, setManagerNotes] = useState("");

  // Legacy (kept)
  const [goals, setGoals] = useState<string[]>([]);
  const [achievements, setAchievements] = useState([
    { title: "First recording", done: false },
    { title: "Score 80+", done: false },
    { title: "5 sessions", done: false },
  ]);

  // Grading
  const [criteria, setCriteria] = useState<Criteria>(defaultCriteria);
  const [history, setHistory] = useState<(Grade & { audioUri?: string | null })[]>([]);

  // Profile
  const [profile, _setProfile] = useState<{ name: string; role: string; org: string; avatarUri?: string }>({
    name: "",
    role: "",
    org: "",
    avatarUri: undefined,
  });

  // ---- Hydrate from storage ----
  useEffect(() => {
    (async () => {
      try {
        const [
          IA, S, A, H, C, P,
          STR, LSD,
          GT, PG, MN,
          GLEG, ACH
        ] = await Promise.all([
          AsyncStorage.getItem("isAuthed"),
          AsyncStorage.getItem("sessions"),
          AsyncStorage.getItem("avgScore"),
          AsyncStorage.getItem("history"),
          AsyncStorage.getItem("criteria"),
          AsyncStorage.getItem("profile"),

          AsyncStorage.getItem("streak"),
          AsyncStorage.getItem("lastSubmitDate"),

          AsyncStorage.getItem("goalsToday"),
          AsyncStorage.getItem("prevGoals"),
          AsyncStorage.getItem("managerNotes"),

          AsyncStorage.getItem("goals"),
          AsyncStorage.getItem("achievements"),
        ]);

        if (IA) setIsAuthed(IA === "1");
        if (S) setSessions(Number(S));
        if (A) setAvgScore(Number(A));
        if (H) setHistory(JSON.parse(H));
        if (C) setCriteria(JSON.parse(C));
        if (P) _setProfile(JSON.parse(P));

        if (STR) setStreak(Number(STR));
        if (LSD) {
          const n = Number(LSD);
          setLastSubmitDate(Number.isFinite(n) ? n : null);
        }

        if (GT) setGoalsToday(JSON.parse(GT));
        if (PG) setPrevGoals(JSON.parse(PG));
        if (MN) setManagerNotes(JSON.parse(MN));

        if (GLEG) setGoals(JSON.parse(GLEG));
        if (ACH) setAchievements(JSON.parse(ACH));
      } catch {
        // ignore
      }
    })();
  }, []);

  // ---- Persist slices ----
  useEffect(() => { AsyncStorage.setItem("isAuthed", isAuthed ? "1" : "0"); }, [isAuthed]);

  useEffect(() => { AsyncStorage.setItem("sessions", String(sessions)); }, [sessions]);
  useEffect(() => { AsyncStorage.setItem("avgScore", String(avgScore)); }, [avgScore]);
  useEffect(() => { AsyncStorage.setItem("history", JSON.stringify(history)); }, [history]);
  useEffect(() => { AsyncStorage.setItem("criteria", JSON.stringify(criteria)); }, [criteria]);
  useEffect(() => { AsyncStorage.setItem("profile", JSON.stringify(profile)); }, [profile]);

  useEffect(() => { AsyncStorage.setItem("streak", String(streak)); }, [streak]);
  useEffect(() => { AsyncStorage.setItem("lastSubmitDate", lastSubmitDate != null ? String(lastSubmitDate) : ""); }, [lastSubmitDate]);

  useEffect(() => { AsyncStorage.setItem("goalsToday", JSON.stringify(goalsToday)); }, [goalsToday]);
  useEffect(() => { AsyncStorage.setItem("prevGoals", JSON.stringify(prevGoals)); }, [prevGoals]);
  useEffect(() => { AsyncStorage.setItem("managerNotes", JSON.stringify(managerNotes)); }, [managerNotes]);

  useEffect(() => { AsyncStorage.setItem("goals", JSON.stringify(goals)); }, [goals]);
  useEffect(() => { AsyncStorage.setItem("achievements", JSON.stringify(achievements)); }, [achievements]);

  // ---- Auth ----
  async function signIn(username: string) {
    setIsAuthed(true);
    if (username && !profile.name) _setProfile((p) => ({ ...p, name: username }));
  }

  async function signOut() {
    setIsAuthed(false);
    // (Optional) also clear runtime state if you want a “fresh” app after logout
    // setHistory([]); setGoalsToday([]); setPrevGoals([]); etc.
  }

  // ---- Goals (new) ----
  function addTodayGoal(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const item: TodayGoal = { id: Date.now(), text: trimmed, done: false, createdAt: Date.now() };
    setGoalsToday((x) => [item, ...x]);
  }

  // Visual toggle only (for green check flash)
  function toggleTodayGoal(id: number) {
    setGoalsToday((list) => list.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));
  }

  // After short delay, move to accomplished
  function completeTodayGoal(id: number) {
    setGoalsToday((list) => {
      const item = list.find((g) => g.id === id);
      if (!item || !item.done) return list;
      setPrevGoals((p) => [{ id: item.id, text: item.text, completedAt: Date.now() }, ...p]);
      return list.filter((g) => g.id !== id);
    });
  }

  function removePrevGoal(id: number) {
    setPrevGoals((p) => p.filter((g) => g.id !== id));
  }

  // ---- Legacy helpers (kept) ----
  function addGoal(g: string) { setGoals((x) => [g, ...x]); }
  function toggleAchievement(i: number) {
    setAchievements((arr) => arr.map((a, idx) => (idx === i ? { ...a, done: !a.done } : a)));
  }
  function updateCriteria(c: Criteria) { setCriteria(c); }
  function setProfile(p: { name: string; role: string; org: string; avatarUri?: string }) { _setProfile(p); }

  // ---- Grading + streak ----
  async function addRecording(r: RecordingInput): Promise<Grade> {
    const score = gradeFrom(r.transcript, criteria);
    const g: Grade = {
      id: Date.now(),
      createdAt: Date.now(),
      score,
      positives: pickPositives(criteria),
      suggestions: pickSuggestions(criteria),
    };

    setHistory((h) => [{ ...g, audioUri: r.uri }, ...h]);

    const newSessions = sessions + 1; setSessions(newSessions);
    const newAvg = isFinite(avgScore) ? (avgScore * sessions + score) / newSessions : score; setAvgScore(newAvg);

    // Streak (daily)
    const now = Date.now();
    const today = epochDay(now);
    const last = lastSubmitDate != null ? epochDay(lastSubmitDate) : null;
    if (last === null) { setStreak(1); setLastSubmitDate(now); }
    else if (last === today) { setLastSubmitDate(now); }
    else if (last === today - 1) { setStreak((s) => s + 1); setLastSubmitDate(now); }
    else { setStreak(1); setLastSubmitDate(now); }

    // legacy achievements
    setAchievements((arr) => arr.map((a) => (a.title === "First recording" ? { ...a, done: true } : a)));
    if (score >= 80) setAchievements((arr) => arr.map((a) => (a.title === "Score 80+" ? { ...a, done: true } : a)));
    if (newSessions >= 5) setAchievements((arr) => arr.map((a) => (a.title === "5 sessions" ? { ...a, done: true } : a)));

    return g;
  }

  const colors = DARK_COLORS; // fixed dark

  const value: AppState = useMemo(
    () => ({
      // auth
      isAuthed, signIn, signOut,

      // stats
      sessions, avgScore, streak, lastSubmitDate,

      // goals
      goalsToday, prevGoals, managerNotes,
      addTodayGoal, toggleTodayGoal, completeTodayGoal, removePrevGoal, setManagerNotes,

      // legacy
      goals, addGoal, achievements, toggleAchievement,

      // grading
      criteria, updateCriteria, history, addRecording,

      // profile
      profile, setProfile,
    }),
    [
      isAuthed,
      sessions, avgScore, streak, lastSubmitDate,
      goalsToday, prevGoals, managerNotes,
      goals, achievements,
      criteria, history, profile
    ]
  );

  return (
    <ThemeCtx.Provider value={{ colors, isDark: true as const, toggleTheme: () => {} }}>
      <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
    </ThemeCtx.Provider>
  );
}

// ---- Hooks ----
export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within AppProvider");
  return ctx;
}

// ---- Placeholder grading heuristics ----
function gradeFrom(text: string, c: Criteria) {
  let base = 60 + Math.min(20, Math.floor((text?.length || 0) / 80));
  if (c.clarity) base += 5;
  if (c.empathy) base += 6;
  if (c.conciseness) base += 4;
  if (c.objectionHandling) base += 3;
  if (c.productKnowledge) base += 2;
  return Math.max(0, Math.min(100, base));
}
function pickPositives(c: Criteria): string[] {
  const out: string[] = [];
  if (c.clarity) out.push("Clear structure and messaging");
  if (c.empathy) out.push("Good rapport and empathetic language");
  if (c.conciseness) out.push("Concise delivery with minimal filler");
  if (c.objectionHandling) out.push("Handled objections effectively");
  if (c.productKnowledge) out.push("Strong product knowledge");
  if (!out.length) out.push("Engaging delivery");
  return out.slice(0, 3);
}
function pickSuggestions(_: Criteria): string[] {
  const bank = [
    "Slow down slightly and pause after key points",
    "Ask one more open-ended question",
    "Summarize next steps at the end",
    "Reduce filler words like 'um' and 'like'",
    "Bring examples to illustrate benefits",
  ];
  return bank.slice(0, 3);
}
