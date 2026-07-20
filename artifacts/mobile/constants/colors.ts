/**
 * Semantic design tokens for the mobile app.
 * A warm, colorful, and reassuring palette for Table Talk.
 */

export type AccentKey = "coral" | "teal" | "purple" | "sky" | "rose";

/** Per-accent primary + primaryForeground pairs for light and dark mode. */
export const ACCENT_OPTIONS: Record<
  AccentKey,
  { label: string; light: string; dark: string; foreground: string }
> = {
  coral:  { label: "Coral",  light: "#E0603C", dark: "#F07B54", foreground: "#FFFFFF" },
  teal:   { label: "Teal",   light: "#2E9B87", dark: "#43B49E", foreground: "#FFFFFF" },
  purple: { label: "Purple", light: "#7C5CBF", dark: "#9B7FD4", foreground: "#FFFFFF" },
  sky:    { label: "Sky",    light: "#3B82C4", dark: "#5B9FE0", foreground: "#FFFFFF" },
  rose:   { label: "Rose",   light: "#C4517A", dark: "#E07A9C", foreground: "#FFFFFF" },
};

const colors = {
  light: {
    text: "#362B24",
    tint: "#E0603C",

    // Core surfaces
    background: "#FDF4EA", // Warm cream
    foreground: "#362B24", // Deep warm brown for text

    // Cards / elevated surfaces
    card: "#FFFFFF",
    cardForeground: "#362B24",

    // Primary action color (buttons, links, active states)
    primary: "#E0603C", // Vibrant coral-terracotta
    primaryForeground: "#FFFFFF",

    // Secondary / less-emphasis interactive surfaces
    secondary: "#FCE8CF", // Soft apricot
    secondaryForeground: "#7A5324",

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: "#F5E8DB",
    mutedForeground: "#967E6E",

    // Accent highlights (badges, selected items, focus rings)
    accent: "#2E9B87", // Lively teal-green for positive reinforcement
    accentForeground: "#FFFFFF",

    // Destructive actions (delete, error states)
    destructive: "#DE5B5B",
    destructiveForeground: "#FFFFFF",

    // Borders and input outlines
    border: "#F0DDC9",
    input: "#F0DDC9",

    // Soft categorical tints (low sensory)
    tints: {
      lavender: "#E8E2F2",
      mint: "#E2F0EA",
      peach: "#FDEBD9",
      sky: "#E2EDF4",
      rose: "#F7E1E6",
      lemon: "#FBF3D4",
    },
  },
  dark: {
    text: "#FBF3EA",
    tint: "#F07B54",

    background: "#2A211B",
    foreground: "#FBF3EA",

    card: "#382C24",
    cardForeground: "#FBF3EA",

    primary: "#F07B54",
    primaryForeground: "#FFFFFF",

    secondary: "#4A3A2A",
    secondaryForeground: "#F7DFC0",

    muted: "#463930",
    mutedForeground: "#B29C8D",

    accent: "#43B49E",
    accentForeground: "#FFFFFF",

    destructive: "#E36D6D",
    destructiveForeground: "#FFFFFF",

    border: "#4A3B31",
    input: "#4A3B31",

    // Soft categorical tints for dark mode (subdued, low contrast)
    tints: {
      lavender: "#3B3347",
      mint: "#30423A",
      peach: "#4D3B2E",
      sky: "#304047",
      rose: "#4A3137",
      lemon: "#4A462B",
    },
  },

  radius: 16,
};

export default colors;
