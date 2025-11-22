import { View, Text, StyleSheet } from "react-native";
import PlaybackControls from "../components/PlaybackControls";
import ProgressBar from "../components/ProgressBar";
import { usePlayer } from "../context/PlayerContext";

export default function PlayerScreen({ route }) {
  const {
    playlist,
    currentIndex,
    status,
    togglePlayPause,
    nextTrack,
    previousTrack,
    onSlide,
    loopMode,
    setLoopMode,
  } = usePlayer();

  // const { song, songList } = route.params;

  // // Current index
  // const [currentIndex, setCurrentIndex] = useState(
  //   songList.findIndex((s) => s.id === song.id)
  // );

  // const [loopMode, setLoopMode] = useState("off");

  // // Create the audio player ONCE (initial empty)
  // const player = useAudioPlayer(null);

  // // Listen to playback status
  // const status = useAudioPlayerStatus(player);

  // // Load the audio whenever currentIndex changes
  // useEffect(() => {
  //   const source = { uri: songList[currentIndex].uri };
  //   player.replace(source);
  // }, [currentIndex]);

  // const handleLoopToggle = () => {
  //   if (loopMode === "off") {
  //     setLoopMode("one");
  //     player.loop = true;
  //   } else if (loopMode === "one") {
  //     setLoopMode("all");
  //     player.addListener("playbackStatusUpdate", (status) => {
  //       if (status.didJustFinish) {
  //         handleTrackEnd();
  //       }
  //     });
  //   } else setLoopMode("off");
  // };

  // const handleTrackEnd = () => {
  //   const nextIndex = (currentIndex + 1) % playlist.length;
  //   setCurrentIndex(nextIndex);

  //   player.replace({ uri: playlist[nextIndex].uri });
  //   player.play();
  // };
  // // Play/Pause
  // const handlePlayPause = () => {
  //   if (!status.isLoaded) return;

  //   if (status.playing) player.pause();
  //   else player.play();
  // };

  // // Next
  // const handleNext = () => {
  //   let next = currentIndex + 1;
  //   if (next >= songList.length) return;
  //   setCurrentIndex(next);
  // };

  // // Prev
  // const handlePrevious = () => {
  //   let prev = currentIndex - 1;
  //   if (prev < 0) return;
  //   setCurrentIndex(prev);
  // };

  // // Seek slider
  // const onSlide = (val) => player.seekTo(val / 1000); // expo-audio uses seconds

  return (
    <View style={styles.container}>
      <Text style={styles.songTitle}>{playlist[currentIndex].title}</Text>

      <ProgressBar
        position={(status.currentTime || 0) * 1000}
        duration={(status.duration || 1) * 1000}
        onSlide={onSlide}
      />

      <PlaybackControls
        isPlaying={status.playing}
        onPlayPause={togglePlayPause}
        onNext={nextTrack}
        onPrevious={previousTrack}
        loopMode={loopMode}
        onLoopToggle={setLoopMode}
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
