import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useAudioPlayer } from "expo-audio";
import SearchBar from "../components/SearchBar";
import SongList from "../components/SongList";

const audioSource = require("../assets/song.mp3");
import { useNavigation } from "@react-navigation/native";

import { songs } from "../assets/dummySongs";
const song = songs[0];

const HomeScreen = () => {
  // const player = useAudioPlayer(audioSource);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <SearchBar />
      <SongList
        songs={songs}
        onSongPress={() => {
          return navigation.navigate("Player", { song: song, songList: songs });
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
