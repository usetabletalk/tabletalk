import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

type AppState = {
  completedScenarios: string[];
  savedTips: string[];
  userName: string;
  userPronouns: string;
  themeMode: ThemeMode;
};

type AppContextType = {
  state: AppState;
  markScenarioCompleted: (id: string) => void;
  toggleSavedTip: (id: string) => void;
  updateProfile: (fields: { userName?: string; userPronouns?: string }) => void;
  updateThemeMode: (mode: ThemeMode) => void;
  isLoaded: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "@gfg_app_state_v1";

const DEFAULT_STATE: AppState = {
  completedScenarios: [],
  savedTips: [],
  userName: "",
  userPronouns: "",
  themeMode: "system",
};

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setState({ ...DEFAULT_STATE, ...parsed });
        }
      } catch (e) {
        console.error("Failed to load app state", e);
      } finally {
        isLoadedRef.current = true;
        setIsLoaded(true);
      }
    }
    load();
  }, []);

  // Single persistence effect — runs after every state change, but only
  // once the initial load is complete so we don't overwrite stored data
  // with the default state on first render.
  useEffect(() => {
    if (!isLoadedRef.current) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) => {
      console.error("Failed to persist app state", e);
    });
  }, [state]);

  const markScenarioCompleted = (id: string) => {
    setState((prev) => ({
      ...prev,
      completedScenarios: Array.from(new Set([...prev.completedScenarios, id])),
    }));
  };

  const toggleSavedTip = (id: string) => {
    setState((prev) => {
      const isSaved = prev.savedTips.includes(id);
      return {
        ...prev,
        savedTips: isSaved
          ? prev.savedTips.filter((t) => t !== id)
          : [...prev.savedTips, id],
      };
    });
  };

  const updateProfile = (fields: { userName?: string; userPronouns?: string }) => {
    setState((prev) => ({ ...prev, ...fields }));
  };

  const updateThemeMode = (mode: ThemeMode) => {
    setState((prev) => ({ ...prev, themeMode: mode }));
  };

  return (
    <AppContext.Provider
      value={{ state, markScenarioCompleted, toggleSavedTip, updateProfile, updateThemeMode, isLoaded }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}
