import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

const SongItem = ({ song, onPress, isFavorite, onToggleFavorite }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text>{song.title.toString()}</Text>
      {
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteBtn}>
          <Text style={styles.favoriteIcon}>{isFavorite ? "❤️" : "🤍"}</Text>
        </TouchableOpacity>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e1d9d9ff",
    marginVertical: 4,
    borderRadius: 10,
    width: "100%",
  },

  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 14,
    color: "#555",
  },
  favoriteBtn: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 20,
  },
});

export default SongItem;
