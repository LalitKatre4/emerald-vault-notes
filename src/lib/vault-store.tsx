import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Note = {
  id: string;
  title: string;
  content: string;
  category: string;
  favorite: boolean;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
};

export type Settings = {
  biometric: boolean;
  autoLock: string;
  hidePreviews: boolean;
  screenshotProtection: boolean;
  hideInRecents: boolean;
  defaultCategory: string;
  defaultView: "list" | "grid";
  sortBy: "updated" | "created" | "az";
  darkMode: boolean;
  notifications: boolean;
  language: string;
  premium: boolean;
};

type VaultState = {
  pin: string | null;
  notes: Note[];
  categories: Category[];
  settings: Settings;
  backups: { id: string; createdAt: string; notes: number }[];
};

const now = Date.now();
const iso = (daysAgo: number) => new Date(now - daysAgo * 86400000).toISOString();

const sampleNotes: Note[] = [
  {
    id: "n1",
    title: "Project Ideas",
    content:
      "1. A private journaling app with local encryption.\n2. Offline-first reading list.\n3. A minimal habit tracker with streak vaults.\n\nStart with a small prototype and validate the flows before adding sync.",
    category: "Ideas",
    favorite: true,
    locked: false,
    createdAt: iso(9),
    updatedAt: iso(0),
    deletedAt: null,
  },
  {
    id: "n2",
    title: "Travel Checklist",
    content:
      "Passport and copies\nCharger + power bank\nOffline maps downloaded\nTravel insurance PDF\nEmergency contacts written down",
    category: "Travel",
    favorite: false,
    locked: false,
    createdAt: iso(12),
    updatedAt: iso(1),
    deletedAt: null,
  },
  {
    id: "n3",
    title: "Important Information",
    content:
      "Wi-Fi router admin page and recovery codes location.\nInsurance policy renewal in March.\nKeep this note locked.",
    category: "Important",
    favorite: true,
    locked: true,
    createdAt: iso(20),
    updatedAt: iso(2),
    deletedAt: null,
  },
  {
    id: "n4",
    title: "Personal Thoughts",
    content:
      "Slow mornings are underrated. Writing things down makes the noise quieter — and privacy is what makes honesty possible.",
    category: "Personal",
    favorite: false,
    locked: false,
    createdAt: iso(5),
    updatedAt: iso(3),
    deletedAt: null,
  },
  {
    id: "n5",
    title: "Work Notes",
    content:
      "Sprint review Thursday.\nDraft the security review checklist.\nFollow up on the vault export format.",
    category: "Work",
    favorite: false,
    locked: false,
    createdAt: iso(7),
    updatedAt: iso(4),
    deletedAt: null,
  },
  {
    id: "n6",
    title: "Old Grocery List",
    content: "Coffee, oats, olive oil.",
    category: "Personal",
    favorite: false,
    locked: false,
    createdAt: iso(30),
    updatedAt: iso(25),
    deletedAt: iso(2),
  },
];

const defaultCategories: Category[] = [
  { id: "c1", name: "Personal", icon: "user" },
  { id: "c2", name: "Work", icon: "briefcase" },
  { id: "c3", name: "Ideas", icon: "lightbulb" },
  { id: "c4", name: "Important", icon: "star" },
  { id: "c5", name: "Travel", icon: "plane" },
];

const defaultSettings: Settings = {
  biometric: true,
  autoLock: "5 minutes",
  hidePreviews: false,
  screenshotProtection: true,
  hideInRecents: true,
  defaultCategory: "Personal",
  defaultView: "list",
  sortBy: "updated",
  darkMode: true,
  notifications: false,
  language: "English",
  premium: false,
};

const initialState: VaultState = {
  pin: null,
  notes: sampleNotes,
  categories: defaultCategories,
  settings: defaultSettings,
  backups: [],
};

const STORAGE_KEY = "private-notes-vault-v1";

type Ctx = {
  ready: boolean;
  state: VaultState;
  locked: boolean;
  setLocked: (v: boolean) => void;
  setPin: (pin: string) => void;
  activeNotes: Note[];
  trashedNotes: Note[];
  getNote: (id: string) => Note | undefined;
  createNote: (data: Partial<Note>) => Note;
  updateNote: (id: string, data: Partial<Note>) => void;
  toggleFavorite: (id: string) => void;
  trashNote: (id: string) => void;
  restoreNote: (id: string) => void;
  deleteForever: (id: string) => void;
  emptyTrash: () => void;
  addCategory: (name: string, icon: string) => void;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  updateSettings: (data: Partial<Settings>) => void;
  addBackup: () => void;
  reset: () => void;
};

const VaultContext = createContext<Ctx | null>(null);

export function VaultProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VaultState>(initialState);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as VaultState;
        setState({ ...initialState, ...parsed, settings: { ...defaultSettings, ...parsed.settings } });
        setLocked(Boolean(parsed.pin));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("light-mode", !state.settings.darkMode);
  }, [state.settings.darkMode]);

  const patch = useCallback((fn: (s: VaultState) => VaultState) => setState(fn), []);

  const value = useMemo<Ctx>(() => {
    const activeNotes = state.notes.filter((n) => !n.deletedAt);
    const trashedNotes = state.notes.filter((n) => n.deletedAt);
    return {
      ready,
      state,
      locked,
      setLocked,
      setPin: (pin) => patch((s) => ({ ...s, pin })),
      activeNotes,
      trashedNotes,
      getNote: (id) => state.notes.find((n) => n.id === id),
      createNote: (data) => {
        const stamp = new Date().toISOString();
        const note: Note = {
          id: `n${Math.random().toString(36).slice(2, 9)}`,
          title: data.title?.trim() || "Untitled note",
          content: data.content ?? "",
          category: data.category ?? state.settings.defaultCategory,
          favorite: data.favorite ?? false,
          locked: data.locked ?? false,
          createdAt: stamp,
          updatedAt: stamp,
          deletedAt: null,
        };
        patch((s) => ({ ...s, notes: [note, ...s.notes] }));
        return note;
      },
      updateNote: (id, data) =>
        patch((s) => ({
          ...s,
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, ...data, updatedAt: new Date().toISOString() } : n,
          ),
        })),
      toggleFavorite: (id) =>
        patch((s) => ({
          ...s,
          notes: s.notes.map((n) => (n.id === id ? { ...n, favorite: !n.favorite } : n)),
        })),
      trashNote: (id) =>
        patch((s) => ({
          ...s,
          notes: s.notes.map((n) =>
            n.id === id ? { ...n, deletedAt: new Date().toISOString() } : n,
          ),
        })),
      restoreNote: (id) =>
        patch((s) => ({
          ...s,
          notes: s.notes.map((n) => (n.id === id ? { ...n, deletedAt: null } : n)),
        })),
      deleteForever: (id) => patch((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) })),
      emptyTrash: () => patch((s) => ({ ...s, notes: s.notes.filter((n) => !n.deletedAt) })),
      addCategory: (name, icon) =>
        patch((s) => ({
          ...s,
          categories: [...s.categories, { id: `c${Date.now()}`, name, icon }],
        })),
      renameCategory: (id, name) =>
        patch((s) => {
          const old = s.categories.find((c) => c.id === id)?.name;
          return {
            ...s,
            categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)),
            notes: s.notes.map((n) => (n.category === old ? { ...n, category: name } : n)),
          };
        }),
      deleteCategory: (id) =>
        patch((s) => ({ ...s, categories: s.categories.filter((c) => c.id !== id) })),
      updateSettings: (data) => patch((s) => ({ ...s, settings: { ...s.settings, ...data } })),
      addBackup: () =>
        patch((s) => ({
          ...s,
          backups: [
            {
              id: `b${Date.now()}`,
              createdAt: new Date().toISOString(),
              notes: s.notes.filter((n) => !n.deletedAt).length,
            },
            ...s.backups,
          ],
        })),
      reset: () => setState(initialState),
    };
  }, [state, ready, locked, patch]);

  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}

export function useVault() {
  const ctx = useContext(VaultContext);
  if (!ctx) throw new Error("useVault must be used inside VaultProvider");
  return ctx;
}

export function sortNotes(notes: Note[], sortBy: Settings["sortBy"]) {
  const copy = [...notes];
  if (sortBy === "az") return copy.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === "created")
    return copy.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  return copy.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export function formatWhen(value: string) {
  const d = new Date(value);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function formatFull(value: string) {
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
