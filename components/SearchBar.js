import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  Button,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SearchBar({ query, setQuery, onSettingsPress }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="SearchX"
        editable={true}
        keyboardType="default"
        value={query}
        onChangeText={setQuery}
        style={styles.SearchInput}
      />
      <TouchableOpacity style={styles.gearButton} onPress={onSettingsPress}>
        <Ionicons name="settings-sharp" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    gap: 10,
  },
  SearchInput: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 10,
    padding: 6,
  },
  gearButton: {
    padding: 8,
    backgroundColor: "#010305ff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
