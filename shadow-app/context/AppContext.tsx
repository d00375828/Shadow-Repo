import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState, } from "react";

// Theme
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
const LIGHT_COLORS = {
  bg: "#fff",
  fg: "#000",
  muted: "#666",
  accent: "#4cff00",
  peach: "#ffddba",
  onAccent: "#000",
  box: "#f1f1f1",
  border: "#e1e1e1",
};

// Types 
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

interface AppState {
  sessions: number;
  avgScore: number;
  goals: string[];
  addGoal: (g: string) => void;
  achievements: { title: string; done: boolean }[];
  toggleAchievement: (i: number) => void;

  criteria: Criteria;
  updateCriteria: (c: Criteria) => void;
  history: (Grade & { audioUri?: string | null })[];
  addRecording: (r: RecordingInput) => Promise<Grade>;

  profile: { name: string; role: string; org: string; avatarUri?: string };
  setProfile: (p: {
    name: string;
    role: string;
    org: string;
    avatarUri?: string;
  }) => void;
}

//  Defaults/Contexts 
const defaultCriteria: Criteria = {
  clarity: true,
  empathy: true,
  conciseness: true,
  objectionHandling: false,
  productKnowledge: false,
};

const AppCtx = createContext<AppState | null>(null);
const ThemeCtx = createContext<{
  colors: typeof DARK_COLORS;
  isDark: boolean;
  toggleTheme: () => void;
} | null>(null);

//  Provider 
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState(0);
  const [avgScore, setAvgScore] = useState(NaN);
  const [goals, setGoals] = useState<string[]>([]);
  const [achievements, setAchievements] = useState([
    { title: "First recording", done: false },
    { title: "Score 80+", done: false },
    { title: "5 sessions", done: false },
  ]);
  const [criteria, setCriteria] = useState<Criteria>(defaultCriteria);
  const [history, setHistory] = useState<
    (Grade & { audioUri?: string | null })[]
  >([]);
  const [profile, _setProfile] = useState<{
    name: string;
    role: string;
    org: string;
    avatarUri?: string;
  }>({
    name: "",
    role: "",
    org: "",
    avatarUri: undefined,
  });
  const [isDark, setIsDark] = useState(true);

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const [S, A, G, C, H, P, T] = await Promise.all([
          AsyncStorage.getItem("sessions"),
          AsyncStorage.getItem("avgScore"),
          AsyncStorage.getItem("goals"),
          AsyncStorage.getItem("criteria"),
          AsyncStorage.getItem("history"),
          AsyncStorage.getItem("profile"),
          AsyncStorage.getItem("theme"),
        ]);
        if (S) setSessions(Number(S));
        if (A) setAvgScore(Number(A));
        if (G) setGoals(JSON.parse(G));
        if (C) setCriteria(JSON.parse(C));
        if (H) setHistory(JSON.parse(H));
        if (P) _setProfile(JSON.parse(P));
        if (T) setIsDark(T === "dark");
      } catch {
      }
    })();
  }, []);

  // Persist slices
  useEffect(() => {
    AsyncStorage.setItem("sessions", String(sessions));
  }, [sessions]);
  useEffect(() => {
    AsyncStorage.setItem("avgScore", String(avgScore));
  }, [avgScore]);
  useEffect(() => {
    AsyncStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);
  useEffect(() => {
    AsyncStorage.setItem("criteria", JSON.stringify(criteria));
  }, [criteria]);
  useEffect(() => {
    AsyncStorage.setItem("history", JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    AsyncStorage.setItem("profile", JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    AsyncStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  // Mutators
  function addGoal(g: string) {
    setGoals((x) => [g, ...x]);
  }
  function toggleAchievement(i: number) {
    setAchievements((arr) =>
      arr.map((a, idx) => (idx === i ? { ...a, done: !a.done } : a))
    );
  }
  function updateCriteria(c: Criteria) {
    setCriteria(c);
  }
  function setProfile(p: {
    name: string;
    role: string;
    org: string;
    avatarUri?: string;
  }) {
    _setProfile(p);
  }

  async function addRecording(r: RecordingInput): Promise<Grade> {
    const score = gradeFrom(r.transcript, criteria);
    const g: Grade = {
      id: Date.now(),
      createdAt: Date.now(),
      score,
      positives: pickPositives(criteria),
      suggestions: pickSuggestions(criteria),
    };

    // update history and stats
    setHistory((h) => [{ ...g, audioUri: r.uri }, ...h]);
    const newSessions = sessions + 1;
    setSessions(newSessions);
    const newAvg = isFinite(avgScore)
      ? (avgScore * sessions + score) / newSessions
      : score;
    setAvgScore(newAvg);

    // achievements
    setAchievements((arr) =>
      arr.map((a) => (a.title === "First recording" ? { ...a, done: true } : a))
    );
    if (score >= 80)
      setAchievements((arr) =>
        arr.map((a) => (a.title === "Score 80+" ? { ...a, done: true } : a))
      );
    if (newSessions >= 5)
      setAchievements((arr) =>
        arr.map((a) => (a.title === "5 sessions" ? { ...a, done: true } : a))
      );

    return g;
  }

  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  const value: AppState = useMemo(
    () => ({
      sessions,
      avgScore,
      goals,
      addGoal,
      achievements,
      toggleAchievement,
      criteria,
      updateCriteria,
      history,
      addRecording,
      profile,
      setProfile,
    }),
    [sessions, avgScore, goals, achievements, criteria, history, profile]
  );

  return (
    <ThemeCtx.Provider
      value={{ colors, isDark, toggleTheme: () => setIsDark((s) => !s) }}
    >
      <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
    </ThemeCtx.Provider>
  );
}

//  Hooks 
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

//  Placeholder grading heuristics
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
