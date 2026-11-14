import React, { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Artwork from "./Artwork";
import IconButton from "./IconButton";
import { colors, spacing } from "../theme";
import { formatTime } from "../utils/format";

export const SONG_ITEM_HEIGHT = 68;

function SongItem({ song, isCurrent, onPress, onToggleFavorite, onMore }) {
  const subtitle = [song.artist ?? "Unknown artist", song.duration ? formatTime(song.duration) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <Pressable
      onPress={() => onPress(song)}
      onLongPress={() => onMore(song)}
      android_ripple={{ color: "rgba(255,255,255,0.06)" }}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${song.title}, ${song.artist ?? "Unknown artist"}`}
      accessibilityHint="Plays this song. Long press for more options."
      accessibilityState={{ selected: isCurrent }}
    >
      <Artwork seed={song.id} size={48} />
      <View style={styles.text}>
        <Text style={[styles.title, isCurrent && styles.titleActive]} numberOfLines={1}>
          {song.title}
        </Text>
        <View style={styles.subtitleRow}>
          {isCurrent && (
            <Ionicons name="volume-medium" size={13} color={colors.accent} style={styles.nowIcon} />
          )}
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
      </View>
      <IconButton
        name={song.isFavorite ? "heart" : "heart-outline"}
        color={song.isFavorite ? colors.favorite : colors.textMuted}
        size={22}
        onPress={() => onToggleFavorite(song.id)}
        label={song.isFavorite ? "Remove from favorites" : "Add to favorites"}
      />
      <IconButton
        name="ellipsis-vertical"
        color={colors.textMuted}
        size={20}
        onPress={() => onMore(song)}
        label={`More options for ${song.title}`}
      />
    </Pressable>
  );
}

export default memo(SongItem);

const styles = StyleSheet.create({
  row: {
    height: SONG_ITEM_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
  },
  pressed: {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  text: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  titleActive: {
    color: colors.accent,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  nowIcon: {
    marginRight: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    flexShrink: 1,
  },
});
