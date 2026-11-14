import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

/** Icon-only button with a 44pt minimum touch target and an accessibility label. */
export default function IconButton({
  name,
  size = 24,
  color = colors.text,
  onPress,
  label,
  disabled = false,
  style,
  hitSlop = 8,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      android_ripple={{ color: "rgba(255,255,255,0.12)", borderless: true }}
      style={({ pressed }) => [
        styles.base,
        { opacity: disabled ? 0.35 : pressed ? 0.6 : 1 },
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
