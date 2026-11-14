import { DarkTheme } from "@react-navigation/native";

export const colors = {
  background: "#0B0B0F",
  surface: "#16161D",
  surfaceRaised: "#1F1F29",
  border: "#2A2A36",
  text: "#F5F5F7",
  textMuted: "#A1A1AE",
  textFaint: "#6B6B78",
  accent: "#1DB954",
  accentMuted: "rgba(29, 185, 84, 0.16)",
  favorite: "#FF4D6D",
  danger: "#FF5A5F",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999,
};

export const type = {
  title: { fontSize: 28, fontWeight: "700", color: colors.text },
  heading: { fontSize: 20, fontWeight: "700", color: colors.text },
  body: { fontSize: 16, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
};

export const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
};
