import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";
import { useLibrary } from "../context/LibraryContext";

/** Wraps library import with a busy flag and user-facing feedback. */
export function useImportSongs() {
  const { importSongs: runImport } = useLibrary();
  const [importing, setImporting] = useState(false);
  const busy = useRef(false);

  const importSongs = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setImporting(true);
    try {
      const { songs, skipped, failed } = await runImport();
      const notes = [];
      if (skipped) notes.push(`${skipped} already in your library`);
      if (failed) notes.push(`${failed} couldn't be imported`);
      if (notes.length) {
        const added = songs.length ? `Added ${songs.length}. ` : "";
        Alert.alert("Import finished", `${added}${notes.join(", ")}.`);
      }
    } catch (err) {
      console.warn("[import]", err);
      Alert.alert("Couldn't add songs", "Something went wrong while opening your files. Please try again.");
    } finally {
      busy.current = false;
      setImporting(false);
    }
  }, [runImport]);

  return { importSongs, importing };
}
