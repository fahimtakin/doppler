import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAudioPlayer } from "expo-audio";
import SearchBar from "../components/SearchBar";
import SongList from "../components/SongList";
const audioSource = require("../assets/song.mp3");
import { useNavigation } from "@react-navigation/native";
import { usePlayer } from "../context/PlayerContext";

const HomeScreen = () => {
  const { playlist, currentIndex } = usePlayer();

  // const player = useAudioPlayer(audioSource);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <SearchBar
        onSettingsPress={() => {
          return navigation.navigate("Player", {
            song: playlist[currentIndex],
            songList: playlist,
          });
        }}
      />
      <SongList
        songs={playlist}
        onSongPress={() => {
          return navigation.navigate("Player", {
            song: playlist[currentIndex],
            songList: playlist,
          });
        }}
      />
      {/* <Pressable style={styles.btn} onPress={() => {
        player.seekTo(0)
        // player.play()
        }}>
      <Text style={styles.btnText}>Click Meee</Text>
    </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
});

export default HomeScreen;
