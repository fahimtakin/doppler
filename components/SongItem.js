import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function SongItem({
  song,
  onPress,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={styles.songName}>{song.name}</Text>
        <Text style={styles.songDetails}>
          {song.artist || "Unknown Artist"}
        </Text>
      </View>

      {onToggleFavorite && (
        <TouchableOpacity
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        >
          <Text style={{ fontSize: 18 }}>{isFavorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  songName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  songDetails: {
    fontSize: 12,
    color: "#555",
  },
  favoriteButton: {
    padding: 8,
  },
});
