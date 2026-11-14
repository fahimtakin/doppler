import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useLibrary } from "./LibraryContext";
import { resolveSongUri } from "../services/audioFiles";
import { KEYS, readJSON, writeJSON } from "../services/storage";
import {
  getNextIndex,
  getPreviousIndex,
  nextRepeatMode,
  removeFromQueue,
  shuffleIds,
} from "../utils/queue";

const PlayerContext = createContext(null);

/** Pressing "previous" past this point restarts the song instead. */
const RESTART_THRESHOLD_SECONDS = 3;

const EMPTY_QUEUE = { baseQueue: [], queue: [], index: -1 };
const NO_SLEEP = { endsAt: null, endOfTrack: false };

export function PlayerProvider({ children }) {
  const { songsById, hydrated: libraryHydrated, updateSong } = useLibrary();
  const player = useAudioPlayer(null, { updateInterval: 500 });

  const [queueState, setQueueState] = useState(EMPTY_QUEUE);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");
  const [sleep, setSleep] = useState(NO_SLEEP);
  const [prefsHydrated, setPrefsHydrated] = useState(false);

  // Refs give the native status listener access to fresh state without
  // re-subscribing on every change.
  const songsRef = useRef(songsById);
  const queueRef = useRef(queueState);
  const repeatRef = useRef(repeat);
  const shuffleRef = useRef(shuffle);
  const sleepRef = useRef(sleep);
  const loadedIdRef = useRef(null);
  const durationSyncedRef = useRef(null);
  songsRef.current = songsById;
  queueRef.current = queueState;
  repeatRef.current = repeat;
  shuffleRef.current = shuffle;
  sleepRef.current = sleep;

  const currentSongId = queueState.queue[queueState.index] ?? null;
  const currentSong = currentSongId ? songsById.get(currentSongId) ?? null : null;

  // ---- Audio session -------------------------------------------------------

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
      interruptionModeAndroid: "doNotMix",
    }).catch((err) => console.warn("[player] audio mode", err));
  }, []);

  // ---- Lock screen / media notification -------------------------------------
  // On Android this also runs the media foreground service that keeps
  // playback alive when the app is in the background.

  const lockScreenActiveRef = useRef(false);
  useEffect(() => {
    try {
      if (!currentSong) {
        if (lockScreenActiveRef.current) {
          player.clearLockScreenControls();
          lockScreenActiveRef.current = false;
        }
        return;
      }
      const metadata = {
        title: currentSong.title,
        artist: currentSong.artist ?? "Unknown artist",
        albumTitle: "Doppler",
      };
      if (lockScreenActiveRef.current) {
        player.updateLockScreenMetadata(metadata);
      } else {
        player.setActiveForLockScreen(true, metadata, {
          showSeekForward: true,
          showSeekBackward: true,
        });
        lockScreenActiveRef.current = true;
      }
    } catch (err) {
      console.warn("[player] lock screen", err);
    }
  }, [player, currentSong?.id, currentSong?.title, currentSong?.artist]);

  // ---- Core loading --------------------------------------------------------

  const loadSong = useCallback(
    (songId, autoplay) => {
      const song = songsRef.current.get(songId);
      if (!song) return false;
      const uri = resolveSongUri(song);
      if (!uri) return false;
      player.replace({ uri });
      loadedIdRef.current = songId;
      durationSyncedRef.current = null;
      if (autoplay) player.play();
      return true;
    },
    [player],
  );

  const goToIndex = useCallback(
    (index, autoplay = true) => {
      const { queue } = queueRef.current;
      const songId = queue[index];
      if (songId == null) return;
      const next = { ...queueRef.current, index };
      queueRef.current = next;
      setQueueState(next);
      loadSong(songId, autoplay);
    },
    [loadSong],
  );

  const stopAtEnd = useCallback(() => {
    player.pause();
    player.seekTo(0).catch(() => {});
  }, [player]);

  // ---- Public controls -----------------------------------------------------

  /** Starts playing `songId` with `listIds` (the visible list) as the queue. */
  const playFromList = useCallback(
    (songId, listIds) => {
      const baseQueue = listIds.includes(songId) ? listIds : [songId, ...listIds];
      const queue = shuffleRef.current ? shuffleIds(baseQueue, songId) : baseQueue;
      const index = queue.indexOf(songId);

      if (loadedIdRef.current === songId && queueRef.current.queue[queueRef.current.index] === songId) {
        // Same song tapped again: just update the queue and keep playing.
        queueRef.current = { baseQueue, queue, index };
        setQueueState(queueRef.current);
        if (!player.playing) player.play();
        return;
      }

      queueRef.current = { baseQueue, queue, index };
      setQueueState(queueRef.current);
      loadSong(songId, true);
    },
    [loadSong, player],
  );

  const togglePlayPause = useCallback(() => {
    const { queue, index } = queueRef.current;
    const songId = queue[index];
    if (songId == null) return;

    if (player.playing) {
      player.pause();
      return;
    }
    if (loadedIdRef.current !== songId) {
      loadSong(songId, true);
      return;
    }
    // Replay from the start if we stopped at the end of the track.
    if (player.duration > 0 && player.currentTime >= player.duration - 0.25) {
      player.seekTo(0).catch(() => {});
    }
    player.play();
  }, [player, loadSong]);

  const next = useCallback(() => {
    const { queue, index } = queueRef.current;
    const i = getNextIndex(index, queue.length, repeatRef.current, { fromUser: true });
    if (i >= 0) goToIndex(i, true);
  }, [goToIndex]);

  const previous = useCallback(() => {
    const { queue, index } = queueRef.current;
    if (queue.length === 0) return;
    if (player.currentTime > RESTART_THRESHOLD_SECONDS) {
      player.seekTo(0).catch(() => {});
      return;
    }
    goToIndex(getPreviousIndex(index, queue.length), true);
  }, [goToIndex, player]);

  const seekTo = useCallback(
    (seconds) => {
      player.seekTo(Math.max(0, seconds)).catch(() => {});
    },
    [player],
  );

  const toggleShuffle = useCallback(() => {
    const on = !shuffleRef.current;
    const { baseQueue, queue, index } = queueRef.current;
    const currentId = queue[index] ?? null;
    const nextQueue = on ? shuffleIds(baseQueue, currentId) : baseQueue;
    const nextIndex = currentId == null ? -1 : nextQueue.indexOf(currentId);
    queueRef.current = { baseQueue, queue: nextQueue, index: nextIndex };
    shuffleRef.current = on;
    setQueueState(queueRef.current);
    setShuffle(on);
  }, []);

  const cycleRepeat = useCallback(() => setRepeat((m) => nextRepeatMode(m)), []);

  // ---- Sleep timer ---------------------------------------------------------

  const startSleepTimer = useCallback((minutes) => {
    setSleep({ endsAt: Date.now() + minutes * 60_000, endOfTrack: false });
  }, []);

  const sleepAtEndOfTrack = useCallback(() => {
    setSleep({ endsAt: null, endOfTrack: true });
  }, []);

  const cancelSleepTimer = useCallback(() => setSleep(NO_SLEEP), []);

  // JS timers are throttled in the background, so the status listener below
  // also checks the deadline. This timeout covers the paused/foreground case.
  useEffect(() => {
    if (!sleep.endsAt) return;
    const ms = Math.max(0, sleep.endsAt - Date.now());
    const t = setTimeout(() => {
      player.pause();
      setSleep(NO_SLEEP);
    }, ms);
    return () => clearTimeout(t);
  }, [sleep.endsAt, player]);

  // ---- Native status listener ---------------------------------------------

  useEffect(() => {
    const sub = player.addListener("playbackStatusUpdate", (status) => {
      const { endsAt, endOfTrack } = sleepRef.current;

      if (endsAt && Date.now() >= endsAt) {
        player.pause();
        setSleep(NO_SLEEP);
      }

      // Backfill duration once per loaded song (the picker doesn't give it).
      const loadedId = loadedIdRef.current;
      if (
        loadedId &&
        status.isLoaded &&
        status.duration > 0 &&
        durationSyncedRef.current !== loadedId
      ) {
        durationSyncedRef.current = loadedId;
        const song = songsRef.current.get(loadedId);
        if (song && Math.abs((song.duration || 0) - status.duration) > 1) {
          updateSong(loadedId, { duration: Math.round(status.duration) });
        }
      }

      if (!status.didJustFinish) return;

      if (endOfTrack) {
        setSleep(NO_SLEEP);
        stopAtEnd();
        return;
      }

      const { queue, index } = queueRef.current;
      if (repeatRef.current === "one") {
        player.seekTo(0).then(() => player.play()).catch(() => {});
        return;
      }
      const i = getNextIndex(index, queue.length, repeatRef.current);
      if (i < 0) stopAtEnd();
      else goToIndex(i, true);
    });
    return () => sub.remove();
  }, [player, goToIndex, stopAtEnd, updateSong]);

  // ---- Keep the queue in sync with the library ------------------------------

  useEffect(() => {
    if (!libraryHydrated) return;
    const { baseQueue, queue, index } = queueRef.current;
    const missing = baseQueue.filter((id) => !songsById.has(id));
    if (missing.length === 0) return;

    const currentId = queue[index];
    const result = removeFromQueue(queue, index, missing);
    queueRef.current = {
      baseQueue: baseQueue.filter((id) => songsById.has(id)),
      queue: result.queue,
      index: result.index,
    };
    setQueueState(queueRef.current);

    if (currentId != null && result.index === -1) {
      player.pause();
      loadedIdRef.current = null;
    }
  }, [songsById, libraryHydrated, player]);

  // ---- Persist and restore preferences --------------------------------------

  useEffect(() => {
    if (!libraryHydrated || prefsHydrated) return;
    let cancelled = false;
    readJSON(KEYS.playerPrefs, {}).then((prefs) => {
      if (cancelled) return;
      if (typeof prefs.shuffle === "boolean") setShuffle(prefs.shuffle);
      if (["off", "all", "one"].includes(prefs.repeat)) setRepeat(prefs.repeat);

      // Restore the last song (paused) so the mini player picks up where we left off.
      const ids = [...songsRef.current.keys()];
      if (prefs.lastSongId && songsRef.current.has(prefs.lastSongId)) {
        const queue = prefs.shuffle ? shuffleIds(ids, prefs.lastSongId) : ids;
        queueRef.current = { baseQueue: ids, queue, index: queue.indexOf(prefs.lastSongId) };
        setQueueState(queueRef.current);
        loadSong(prefs.lastSongId, false);
      }
      setPrefsHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [libraryHydrated, prefsHydrated, loadSong]);

  useEffect(() => {
    if (!prefsHydrated) return;
    writeJSON(KEYS.playerPrefs, { shuffle, repeat, lastSongId: currentSongId });
  }, [prefsHydrated, shuffle, repeat, currentSongId]);

  const value = useMemo(
    () => ({
      player,
      currentSong,
      queue: queueState.queue,
      queueIndex: queueState.index,
      shuffle,
      repeat,
      sleep,
      playFromList,
      togglePlayPause,
      next,
      previous,
      seekTo,
      toggleShuffle,
      cycleRepeat,
      startSleepTimer,
      sleepAtEndOfTrack,
      cancelSleepTimer,
    }),
    [
      player,
      currentSong,
      queueState,
      shuffle,
      repeat,
      sleep,
      playFromList,
      togglePlayPause,
      next,
      previous,
      seekTo,
      toggleShuffle,
      cycleRepeat,
      startSleepTimer,
      sleepAtEndOfTrack,
      cancelSleepTimer,
    ],
  );

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

/**
 * Live playback status (position, playing, buffering). Kept out of the main
 * context so only components that show progress re-render twice a second.
 */
export function usePlaybackStatus() {
  const { player } = usePlayer();
  return useAudioPlayerStatus(player);
}
