import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./IconButton";
import { colors, radius, spacing } from "../theme";

export default function SearchBar({ value, onChangeText, placeholder = "Search songs or artists" }) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color={colors.textFaint} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Search library"
      />
      {value.length > 0 && (
        <IconButton
          name="close-circle"
          size={18}
          color={colors.textFaint}
          onPress={() => onChangeText("")}
          label="Clear search"
          style={styles.clear}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingLeft: spacing.md,
    height: 44,
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  clear: {
    minWidth: 40,
  },
});
