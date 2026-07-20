import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useAppState } from "@/contexts/AppStateContext";

/**
 * Returns the design tokens for the current color scheme.
 *
 * Reads `themeMode` from AppStateProvider:
 * - "light" → always returns the light palette
 * - "dark"  → always returns the dark palette
 * - "system" → falls back to the device's appearance setting
 */
export function useColors() {
  const scheme = useColorScheme();
  const { state } = useAppState();

  const effectiveScheme =
    state.themeMode === "light"
      ? "light"
      : state.themeMode === "dark"
        ? "dark"
        : (scheme ?? "light");

  const palette: typeof colors.light =
    effectiveScheme === "dark" && colors.dark ? colors.dark : colors.light;

  return { ...palette, radius: colors.radius };
}
