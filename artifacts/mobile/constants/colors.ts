/**
 * Semantic design tokens for the mobile app.
 * A warm, colorful, and reassuring palette for Table Talk.
 */

export type AccentKey = "coral" | "teal" | "purple" | "sky" | "rose";

/** Per-accent full palette overrides for light and dark mode. */
export const ACCENT_OPTIONS: Record<
  AccentKey,
  {
    label: string;
    light: string; dark: string; foreground: string;
    lightBg: string;      darkBg: string;
    lightSecondary: string; darkSecondary: string;
    lightMuted: string;     darkMuted: string;
    lightBorder: string;    darkBorder: string;
    darkCard: string;
  }
> = {
  coral: {
    label: "Orange",
    light: "#E0603C", dark: "#F07B54", foreground: "#FFFFFF",
    lightBg: "#FDF4EA",       darkBg: "#2A211B",
    lightSecondary: "#FCE8CF", darkSecondary: "#4A3A2A",
    lightMuted: "#F5E8DB",     darkMuted: "#463930",
    lightBorder: "#F0DDC9",    darkBorder: "#4A3B31",
    darkCard: "#382C24",
  },
  teal: {
    label: "Teal",
    light: "#2E9B87", dark: "#43B49E", foreground: "#FFFFFF",
    lightBg: "#EBF6F4",       darkBg: "#1B2B29",
    lightSecondary: "#D4EDE9", darkSecondary: "#243C38",
    lightMuted: "#DBEEE9",     darkMuted: "#1F3330",
    lightBorder: "#C2E3DD",    darkBorder: "#2C4440",
    darkCard: "#253635",
  },
  purple: {
    label: "Purple",
    light: "#7C5CBF", dark: "#9B7FD4", foreground: "#FFFFFF",
    lightBg: "#EEE9F7",       darkBg: "#221F2C",
    lightSecondary: "#DDD5F0", darkSecondary: "#2E2940",
    lightMuted: "#E4DCF2",     darkMuted: "#282438",
    lightBorder: "#D0C6E8",    darkBorder: "#363050",
    darkCard: "#2C2939",
  },
  sky: {
    label: "Blue",
    light: "#3B82C4", dark: "#5B9FE0", foreground: "#FFFFFF",
    lightBg: "#EAF1F8",       darkBg: "#1C2430",
    lightSecondary: "#D4E5F2", darkSecondary: "#253041",
    lightMuted: "#DAE9F4",     darkMuted: "#20293C",
    lightBorder: "#C2D8ED",    darkBorder: "#2C3E52",
    darkCard: "#243040",
  },
  rose: {
    label: "Pink",
    light: "#C4517A", dark: "#E07A9C", foreground: "#FFFFFF",
    lightBg: "#F7EBEF",       darkBg: "#2B1D22",
    lightSecondary: "#F0D8E2", darkSecondary: "#3D2530",
    lightMuted: "#F3DDE4",     darkMuted: "#35202A",
    lightBorder: "#E6C8D4",    darkBorder: "#4A2D3A",
    darkCard: "#352228",
  },
};

const colors = {
  light: {
    text: "#2D2D2D",
    tint: "#E0603C",

    // Core surfaces
    background: "#FDF4EA", // overridden per-accent in useColors
    foreground: "#2D2D2D", // Neutral dark gray

    // Cards / elevated surfaces
    card: "#FFFFFF",
    cardForeground: "#2D2D2D",

    // Primary action color (buttons, links, active states)
    primary: "#E0603C", // overridden per-accent in useColors
    primaryForeground: "#FFFFFF",

    // Secondary / less-emphasis interactive surfaces
    secondary: "#FCE8CF", // overridden per-accent in useColors
    secondaryForeground: "#5A5A5A",

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: "#F5E8DB",      // overridden per-accent in useColors
    mutedForeground: "#8A8A8A",

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
    text: "#F0F0F0",
    tint: "#F07B54",

    background: "#2A211B",  // overridden per-accent in useColors
    foreground: "#F0F0F0",  // Neutral light gray

    card: "#382C24",        // overridden per-accent in useColors
    cardForeground: "#F0F0F0",

    primary: "#F07B54",     // overridden per-accent in useColors
    primaryForeground: "#FFFFFF",

    secondary: "#4A3A2A",   // overridden per-accent in useColors
    secondaryForeground: "#C4C4C4",

    muted: "#463930",       // overridden per-accent in useColors
    mutedForeground: "#9A9A9A",

    accent: "#43B49E",
    accentForeground: "#FFFFFF",

    destructive: "#E36D6D",
    destructiveForeground: "#FFFFFF",

    border: "#4A3B31",
    input: "#4A3B31",

    // Categorical tints for dark mode — saturated enough to stand out on any dark background
    tints: {
      lavender: "#4A3F6E",
      mint: "#1E5C48",
      peach: "#6B4228",
      sky: "#1C4A66",
      rose: "#6B2040",
      lemon: "#5C5018",
    },
  },

  radius: 16,
};

export default colors;
