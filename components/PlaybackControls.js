import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PlaybackControls({
  onPlayPause,
  onNext,
  onPrevious,
  isPlaying,
  loopMode,
  onLoopToggle,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrevious}>
        <Ionicons name="play-skip-back" size={32} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlayPause}>
        <Ionicons
          name={isPlaying ? "pause-circle" : "play-circle"}
          size={48}
          color="#1DB954"
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={onNext}>
        <Ionicons name="play-skip-forward" size={32} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onLoopToggle}>
        <Ionicons
          name={
            loopMode === "one"
              ? "repeat-one"
              : loopMode === "all"
              ? "repeat"
              : loopMode === "shuffle"
              ? "shuffle"
              : "repeat" // default for "off"
          }
          color={loopMode === "off" ? "gray" : "dodgerblue"}
          size={24}
        />
      </TouchableOpacity>

      {
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteBtn}>
          <Ionicons
            name="heart-sharp"
            size={28}
            color={isFavorite ? "white" : "red"}
          />
        </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    alignItems: "center",
  },
});
