import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { KEYS, readJSON, writeJSON } from "../services/storage";
import { deleteSongFile, pickAndImportAudio } from "../services/audioFiles";

const LibraryContext = createContext(null);

const SAVE_DEBOUNCE_MS = 300;

export function LibraryProvider({ children }) {
  const [songs, setSongs] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef(null);

  // Load persisted library once.
  useEffect(() => {
    let cancelled = false;
    readJSON(KEYS.library, { songs: [] }).then((data) => {
      if (cancelled) return;
      setSongs(Array.isArray(data?.songs) ? data.songs : []);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist after hydration, debounced so rapid edits write once.
  useEffect(() => {
    if (!hydrated) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      writeJSON(KEYS.library, { songs });
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(saveTimer.current);
  }, [songs, hydrated]);

  const songsById = useMemo(() => {
    const map = new Map();
    for (const s of songs) map.set(s.id, s);
    return map;
  }, [songs]);

  const songsRef = useRef(songs);
  songsRef.current = songs;

  const importSongs = useCallback(async () => {
    const existing = new Set(songsRef.current.map((s) => s.sourceKey).filter(Boolean));
    const result = await pickAndImportAudio(existing);
    if (result.songs.length > 0) {
      setSongs((prev) => [...prev, ...result.songs]);
    }
    return result;
  }, []);

  const toggleFavorite = useCallback((songId) => {
    setSongs((prev) =>
      prev.map((s) => (s.id === songId ? { ...s, isFavorite: !s.isFavorite } : s)),
    );
  }, []);

  const updateSong = useCallback((songId, patch) => {
    setSongs((prev) => {
      let changed = false;
      const next = prev.map((s) => {
        if (s.id !== songId) return s;
        const merged = { ...s, ...patch };
        changed = Object.keys(patch).some((k) => s[k] !== merged[k]);
        return merged;
      });
      return changed ? next : prev;
    });
  }, []);

  const removeSongs = useCallback((songIds) => {
    const ids = new Set(songIds);
    for (const s of songsRef.current) {
      if (ids.has(s.id)) deleteSongFile(s);
    }
    setSongs((prev) => prev.filter((s) => !ids.has(s.id)));
  }, []);

  const value = useMemo(
    () => ({
      songs,
      songsById,
      hydrated,
      importSongs,
      toggleFavorite,
      updateSong,
      removeSongs,
    }),
    [songs, songsById, hydrated, importSongs, toggleFavorite, updateSong, removeSongs],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used inside <LibraryProvider>");
  return ctx;
}
