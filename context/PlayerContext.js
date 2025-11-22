import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { songs } from "../assets/dummySongs";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loopMode, setLoopMode] = useState("off"); // "off" | "one" | "all"
  const [playlist, setPlaylist] = useState(songs);
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const [sleepTimer, setSleepTimer] = useState(null); // in minutes
  const timerRef = useRef(null); // store the timeout reference

  // Load current track whenever currentIndex changes
  useEffect(() => {
    if (playlist.length > 0) {
      const source = { uri: playlist[currentIndex].uri };
      player.replace(source);
    }
  }, [currentIndex, playlist]);

  // Handle track end automatically
  useEffect(() => {
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (status.didJustFinish) {
          if (loopMode === "one") {
            player.seekTo(0);
            player.play();
          } else if (loopMode === "all" || currentIndex < playlist.length - 1) {
            setCurrentIndex((prev) => (prev + 1) % playlist.length);
          } else {
            player.pause(); // Stop if last track and loopMode off
          }
        }
      }
    );

    return () => subscription.remove();
  }, [loopMode, currentIndex, playlist]);

  // Slider seek
  const onSlide = (valueInMs) => {
    player.seekTo(valueInMs / 1000);
  };

  // Play / Pause toggle
  const togglePlayPause = () => {
    if (!status.isLoaded) return;
    status.playing ? player.pause() : player.play();
  };

  // Next / Previous
  const nextTrack = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };
  const previousTrack = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  // Sleep timer effect
  useEffect(() => {
    if (sleepTimer && sleepTimer > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        player.pause(); // stop playback when timer ends
        setSleepTimer(null);
      }, sleepTimer * 60 * 1000); // convert minutes to ms
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sleepTimer]);

  return (
    <PlayerContext.Provider
      value={{
        player,
        status,
        currentIndex,
        setCurrentIndex,
        loopMode,
        setLoopMode,
        playlist,
        setPlaylist,
        onSlide,
        togglePlayPause,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
