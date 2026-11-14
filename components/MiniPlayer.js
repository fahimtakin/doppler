import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Artwork from "./Artwork";
import IconButton from "./IconButton";
import { usePlaybackStatus, usePlayer } from "../context/PlayerContext";
import { colors, radius, spacing } from "../theme";

export const MINI_PLAYER_HEIGHT = 64;

export default function MiniPlayer() {
  const { currentSong, togglePlayPause, next } = usePlayer();
  const status = usePlaybackStatus();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  if (!currentSong) return null;

  const progress = status.duration > 0 ? Math.min(1, status.currentTime / status.duration) : 0;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <Pressable
        onPress={() => navigation.navigate("Player")}
        style={styles.card}
        accessibilityRole="button"
        accessibilityLabel={`Now playing: ${currentSong.title}. Open player.`}
      >
        <Artwork seed={currentSong.id} size={44} />
        <View style={styles.text}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist ?? "Unknown artist"}
          </Text>
        </View>
        <IconButton
          name={status.playing ? "pause" : "play"}
          size={26}
          onPress={togglePlayPause}
          label={status.playing ? "Pause" : "Play"}
        />
        <IconButton name="play-skip-forward" size={22} onPress={next} label="Next" />
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    backgroundColor: "rgba(11,11,15,0.92)",
  },
  card: {
    height: MINI_PLAYER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.md,
    paddingLeft: spacing.sm,
    paddingRight: spacing.xs,
    overflow: "hidden",
  },
  text: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  artist: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 1,
  },
  track: {
    position: "absolute",
    left: spacing.sm,
    right: spacing.sm,
    bottom: 0,
    height: 2,
    backgroundColor: colors.border,
  },
  fill: {
    height: 2,
    backgroundColor: colors.accent,
  },
});
