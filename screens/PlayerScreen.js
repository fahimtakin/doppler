import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import PlaybackControls from "../components/PlaybackControls";
import ProgressBar from "../components/ProgressBar";

export default function PlayerScreen({ route }) {
  const { song, songList } = route.params;

  // Current index
  const [currentIndex, setCurrentIndex] = useState(
    songList.findIndex((s) => s.id === song.id)
  );

  // Create the audio player ONCE (initial empty)
  const player = useAudioPlayer(null);

  // Listen to playback status
  const status = useAudioPlayerStatus(player);

  // Load the audio whenever currentIndex changes
  useEffect(() => {
    const source = { uri: songList[currentIndex].uri };
    player.replace(source);
  }, [currentIndex]);

  // Play/Pause
  const handlePlayPause = () => {
    if (!status.isLoaded) return;

    if (status.playing) player.pause();
    else player.play();
  };

  // Next
  const handleNext = () => {
    let next = currentIndex + 1;
    if (next >= songList.length) return;
    setCurrentIndex(next);
  };

  // Prev
  const handlePrevious = () => {
    let prev = currentIndex - 1;
    if (prev < 0) return;
    setCurrentIndex(prev);
  };

  // Seek slider
  const onSlide = (val) => player.seekTo(val / 1000); // expo-audio uses seconds

  return (
    <View style={styles.container}>
      <Text style={styles.songTitle}>{songList[currentIndex].title}</Text>

      <ProgressBar
        position={(status.currentTime || 0) * 1000}
        duration={(status.duration || 1) * 1000}
        onSlide={onSlide}
      />

      <PlaybackControls
        isPlaying={status.playing}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        loopMode={status.loop ? "one" : "off"}
        onLoopToggle={() => (player.loop = !player.loop)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
});
