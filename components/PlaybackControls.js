import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./IconButton";
import { colors } from "../theme";

const REPEAT_LABELS = {
  off: "Repeat off",
  all: "Repeat all",
  one: "Repeat one",
};

export default function PlaybackControls({
  isPlaying,
  shuffle,
  repeat,
  onPlayPause,
  onNext,
  onPrevious,
  onToggleShuffle,
  onCycleRepeat,
}) {
  return (
    <View style={styles.row}>
      <IconButton
        name="shuffle"
        size={24}
        color={shuffle ? colors.accent : colors.textMuted}
        onPress={onToggleShuffle}
        label={shuffle ? "Shuffle on" : "Shuffle off"}
      />
      <IconButton name="play-skip-back" size={34} onPress={onPrevious} label="Previous" />

      <Pressable
        onPress={onPlayPause}
        style={({ pressed }) => [styles.play, pressed && { transform: [{ scale: 0.95 }] }]}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? "Pause" : "Play"}
      >
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={34}
          color="#000"
          style={!isPlaying && { marginLeft: 4 }}
        />
      </Pressable>

      <IconButton name="play-skip-forward" size={34} onPress={onNext} label="Next" />
      <View>
        <IconButton
          name="repeat"
          size={24}
          color={repeat === "off" ? colors.textMuted : colors.accent}
          onPress={onCycleRepeat}
          label={REPEAT_LABELS[repeat]}
        />
        {repeat === "one" && <View style={styles.oneBadge} pointerEvents="none" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  play: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.text,
    alignItems: "center",
    justifyContent: "center",
  },
  oneBadge: {
    position: "absolute",
    bottom: 6,
    alignSelf: "center",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
});
