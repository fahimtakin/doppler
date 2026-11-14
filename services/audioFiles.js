import { Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Directory, File, Paths } from "expo-file-system";
import { parseFileName } from "../utils/format";

/**
 * Picked files land in the app cache, which the OS may clear at any time.
 * We copy them into the documents directory so the library survives.
 * Songs store only the file name; the full URI is resolved at runtime
 * because the documents path can change between app updates on iOS.
 */
const canUseFileSystem = Platform.OS !== "web";

let cachedMusicDir = null;

function musicDir() {
  if (!cachedMusicDir) {
    const dir = new Directory(Paths.document, "music");
    dir.create({ intermediates: true, idempotent: true });
    cachedMusicDir = dir;
  }
  return cachedMusicDir;
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function extensionOf(name) {
  const match = /\.[a-z0-9]{2,5}$/i.exec(name ?? "");
  return match ? match[0].toLowerCase() : ".mp3";
}

export function resolveSongUri(song) {
  if (song.fileName && canUseFileSystem) {
    return new File(musicDir(), song.fileName).uri;
  }
  return song.uri;
}

/**
 * Opens the system picker and imports the chosen audio files.
 * `existingKeys` (name + size) is used to skip files already in the library.
 * Returns { songs, skipped, failed }.
 */
export async function pickAndImportAudio(existingKeys = new Set()) {
  const result = await DocumentPicker.getDocumentAsync({
    type: "audio/*",
    multiple: true,
    copyToCacheDirectory: true,
  });

  if (result.canceled) return { songs: [], skipped: 0, failed: 0 };

  const songs = [];
  let skipped = 0;
  let failed = 0;

  for (const asset of result.assets ?? []) {
    const sourceKey = `${asset.name}:${asset.size ?? 0}`;
    if (existingKeys.has(sourceKey)) {
      skipped++;
      continue;
    }

    const id = makeId();
    const { title, artist } = parseFileName(asset.name);
    const song = {
      id,
      title,
      artist,
      duration: 0,
      isFavorite: false,
      addedAt: Date.now(),
      sourceKey,
    };

    try {
      if (canUseFileSystem) {
        const fileName = `${id}${extensionOf(asset.name)}`;
        const source = new File(asset.uri);
        source.copy(new File(musicDir(), fileName));
        try {
          source.delete();
        } catch {
          // Cache cleanup is best-effort.
        }
        song.fileName = fileName;
      } else {
        song.uri = asset.uri;
      }
      songs.push(song);
      existingKeys.add(sourceKey);
    } catch (err) {
      console.warn("[audioFiles] import failed", asset.name, err);
      failed++;
    }
  }

  return { songs, skipped, failed };
}

export function deleteSongFile(song) {
  if (!song.fileName || !canUseFileSystem) return;
  try {
    const file = new File(musicDir(), song.fileName);
    if (file.exists) file.delete();
  } catch (err) {
    console.warn("[audioFiles] delete failed", song.fileName, err);
  }
}
