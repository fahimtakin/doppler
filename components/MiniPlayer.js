// components/MiniPlayer.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { usePlayer } from "../context/PlayerContext";

export default function MiniPlayer() {
  const {
    playlist,
    currentIndex,
    status,
    togglePlayPause,
    nextTrack,
    previousTrack,
  } = usePlayer();

  if (playlist.length === 0) return null; // hide if no songs

  const currentSong = playlist[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title} numberOfLines={1}>
        {currentSong.title}
      </Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={previousTrack}>
          <Text style={styles.controlText}>⏮️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePlayPause}>
          <Text style={styles.controlText}>{status.playing ? "⏸️" : "▶️"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={nextTrack}>
          <Text style={styles.controlText}>⏭️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1e1e1e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopColor: "#333",
    borderTopWidth: 1,
  },
  title: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
  controls: {
    flexDirection: "row",
    gap: 10,
  },
  controlText: {
    color: "#fff",
    fontSize: 20,
    marginHorizontal: 5,
  },
});
