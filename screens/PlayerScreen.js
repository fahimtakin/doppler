import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Artwork from "../components/Artwork";
import IconButton from "../components/IconButton";
import PlaybackControls from "../components/PlaybackControls";
import ProgressBar from "../components/ProgressBar";
import { useLibrary } from "../context/LibraryContext";
import { usePlaybackStatus, usePlayer } from "../context/PlayerContext";
import { useSleepCountdown } from "../hooks/useSleepCountdown";
import { colors, radius, spacing } from "../theme";

export default function PlayerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { toggleFavorite } = useLibrary();
  const {
    currentSong,
    queue,
    queueIndex,
    shuffle,
    repeat,
    sleep,
    togglePlayPause,
    next,
    previous,
    seekTo,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();
  const status = usePlaybackStatus();
  const sleepLabel = useSleepCountdown(sleep);

  // Close if the current song disappears (e.g. removed from the library).
  useEffect(() => {
    if (!currentSong && navigation.canGoBack()) navigation.goBack();
  }, [currentSong, navigation]);

  if (!currentSong) return <View style={styles.screen} />;

  const artSize = Math.min(width - spacing.xxl * 2, 360);
  const duration = status.duration > 0 ? status.duration : currentSong.duration || 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.topBar}>
        <IconButton name="chevron-down" size={28} onPress={() => navigation.goBack()} label="Close player" />
        <View style={styles.topCenter}>
          <Text style={styles.eyebrow}>PLAYING FROM YOUR LIBRARY</Text>
          <Text style={styles.position}>
            {queueIndex + 1} of {queue.length}
          </Text>
        </View>
        <IconButton
          name="moon-outline"
          size={22}
          color={sleep.endsAt || sleep.endOfTrack ? colors.accent : colors.text}
          onPress={() => navigation.navigate("Settings")}
          label="Sleep timer"
        />
      </View>

      <View style={styles.artWrap}>
        <Artwork seed={currentSong.id} size={artSize} rounded={radius.lg} />
        {status.isBuffering && (
          <ActivityIndicator style={StyleSheet.absoluteFill} color={colors.text} size="large" />
        )}
      </View>

      <View style={styles.meta}>
        <View style={styles.metaText}>
          <Text style={styles.title} numberOfLines={2}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist ?? "Unknown artist"}
          </Text>
        </View>
        <IconButton
          name={currentSong.isFavorite ? "heart" : "heart-outline"}
          size={28}
          color={currentSong.isFavorite ? colors.favorite : colors.text}
          onPress={() => toggleFavorite(currentSong.id)}
          label={currentSong.isFavorite ? "Remove from favorites" : "Add to favorites"}
        />
      </View>

      <ProgressBar position={status.currentTime || 0} duration={duration} onSeek={seekTo} />

      <View style={styles.controls}>
        <PlaybackControls
          isPlaying={status.playing}
          shuffle={shuffle}
          repeat={repeat}
          onPlayPause={togglePlayPause}
          onNext={next}
          onPrevious={previous}
          onToggleShuffle={toggleShuffle}
          onCycleRepeat={cycleRepeat}
        />
      </View>

      {sleepLabel ? (
        <Text style={styles.sleep} accessibilityLiveRegion="polite">
          {sleepLabel}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: -spacing.sm,
  },
  topCenter: {
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.textMuted,
    fontWeight: "600",
  },
  position: {
    fontSize: 13,
    color: colors.text,
    marginTop: 2,
  },
  artWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  metaText: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  artist: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 4,
  },
  controls: {
    marginTop: spacing.lg,
  },
  sleep: {
    textAlign: "center",
    color: colors.accent,
    fontSize: 13,
    marginTop: spacing.lg,
  },
});
