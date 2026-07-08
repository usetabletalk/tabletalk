/**
 * Semantic design tokens for the mobile app.
 * A gentle, warm, and reassuring palette for the Gluten-Free Guide.
 */

const colors = {
  light: {
    text: "#2D2622",
    tint: "#E07A5F",

    // Core surfaces
    background: "#FBF7F4", // Soft, warm off-white
    foreground: "#2D2622", // Deep warm gray/brown for text

    // Cards / elevated surfaces
    card: "#FFFFFF",
    cardForeground: "#2D2622",

    // Primary action color (buttons, links, active states)
    primary: "#D47761", // Gentle terracotta
    primaryForeground: "#FFFFFF",

    // Secondary / less-emphasis interactive surfaces
    secondary: "#EAE0D8",
    secondaryForeground: "#4A3F39",

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: "#F0E8E3",
    mutedForeground: "#8C7C75",

    // Accent highlights (badges, selected items, focus rings)
    accent: "#8CA192", // Soft sage green for positive reinforcement
    accentForeground: "#FFFFFF",

    // Destructive actions (delete, error states)
    destructive: "#DE6B6B",
    destructiveForeground: "#FFFFFF",

    // Borders and input outlines
    border: "#EAE0D8",
    input: "#EAE0D8",
  },
  dark: {
    text: "#FBF7F4",
    tint: "#E07A5F",

    background: "#2D2622",
    foreground: "#FBF7F4",

    card: "#3B332D",
    cardForeground: "#FBF7F4",

    primary: "#E07A5F",
    primaryForeground: "#FFFFFF",

    secondary: "#4A3F39",
    secondaryForeground: "#FBF7F4",

    muted: "#4A3F39",
    mutedForeground: "#A99C95",

    accent: "#8CA192",
    accentForeground: "#FFFFFF",

    destructive: "#DE6B6B",
    destructiveForeground: "#FFFFFF",

    border: "#4A3F39",
    input: "#4A3F39",
  },

  radius: 16,
};

export default colors;
