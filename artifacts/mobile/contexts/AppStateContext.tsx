import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type AppState = {
  completedScenarios: string[];
  savedTips: string[];
};

type AppContextType = {
  state: AppState;
  markScenarioCompleted: (id: string) => Promise<void>;
  toggleSavedTip: (id: string) => Promise<void>;
  isLoaded: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = "@gfg_app_state_v1";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    completedScenarios: [],
    savedTips: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setState(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load app state", e);
      } finally {
        setIsLoaded(true);
      }
    }
    load();
  }, []);

  const markScenarioCompleted = async (id: string) => {
    const newState = {
      ...state,
      completedScenarios: Array.from(new Set([...state.completedScenarios, id])),
    };
    setState(newState);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  const toggleSavedTip = async (id: string) => {
    const isSaved = state.savedTips.includes(id);
    const newSaved = isSaved
      ? state.savedTips.filter((t) => t !== id)
      : [...state.savedTips, id];
    
    const newState = { ...state, savedTips: newSaved };
    setState(newState);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  };

  return (
    <AppContext.Provider
      value={{ state, markScenarioCompleted, toggleSavedTip, isLoaded }}
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
