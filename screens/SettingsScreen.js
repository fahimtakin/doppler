import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { usePlayer } from "../context/PlayerContext";

export default function SettingsScreen() {
  const { setSleepTimer, setPlaylist, playlist, importLocalSongs } =
    usePlayer();
  const [timerMinutes, setTimerMinutes] = useState("");

  const handleSetTimer = () => {
    const minutes = parseInt(timerMinutes);
    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number of minutes.");
      return;
    }
    setSleepTimer(minutes);
    Alert.alert("Timer Set", `Music will stop after ${minutes} minutes.`);
    setTimerMinutes("");
  };

  const handleAddLocalSong = async () => {
    try {
      await importLocalSongs();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Could not add song");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Timer (minutes)</Text>
      <TextInput
        style={styles.input}
        value={timerMinutes}
        onChangeText={setTimerMinutes}
        keyboardType="numeric"
        placeholder="e.g. 15"
      />
      <Button title="Set Timer" onPress={handleSetTimer} />

      <View style={{ height: 30 }} />

      <Button title="Add Local Song" onPress={handleAddLocalSong} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    color: "#fff",
    padding: 10,
    marginBottom: 10,
  },
});
