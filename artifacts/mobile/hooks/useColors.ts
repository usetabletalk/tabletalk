import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { ACCENT_OPTIONS } from "@/constants/colors";
import { useAppState } from "@/contexts/AppStateContext";

/**
 * Returns the design tokens for the current color scheme,
 * with `primary` and `primaryForeground` overridden by the user's chosen accent.
 *
 * Reads `themeMode` from AppStateProvider:
 * - "light" → always returns the light palette
 * - "dark"  → always returns the dark palette
 * - "system" → falls back to the device's appearance setting
 *
 * Reads `accentColor` from AppStateProvider to override the primary pair.
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

  const accent = ACCENT_OPTIONS[state.accentColor] ?? ACCENT_OPTIONS.coral;
  const isDark = effectiveScheme === "dark";
  const primaryColor = isDark ? accent.dark : accent.light;

  return {
    ...palette,
    primary: primaryColor,
    primaryForeground: accent.foreground,
    tint: primaryColor,
    background:  isDark ? accent.darkBg        : accent.lightBg,
    secondary:   isDark ? accent.darkSecondary  : accent.lightSecondary,
    muted:       isDark ? accent.darkMuted      : accent.lightMuted,
    border:      isDark ? accent.darkBorder     : accent.lightBorder,
    input:       isDark ? accent.darkBorder     : accent.lightBorder,
    card:        isDark ? accent.darkCard       : palette.card,
    radius: colors.radius,
  };
}
