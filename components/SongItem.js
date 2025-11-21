import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SongItem = ({ song, onPress, isFavorite, onToggleFavorite }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text>{song.title.toString()}</Text>
      {
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteBtn}>
          <Ionicons
            name="heart-sharp"
            size={24}
            color={isFavorite ? "white" : "red"}
          />
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
