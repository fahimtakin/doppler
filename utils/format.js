/**
 * Formats a duration in seconds as m:ss (or h:mm:ss for long tracks).
 */
export function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";
  const secs = Math.floor(totalSeconds);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const ss = String(s).padStart(2, "0");
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${ss}`;
  return `${m}:${ss}`;
}

/**
 * Derives a display title and artist from a file name.
 * "Artist Name - Song_Title.mp3" -> { artist: "Artist Name", title: "Song Title" }
 */
export function parseFileName(fileName) {
  const base = String(fileName ?? "")
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!base) return { title: "Unknown title", artist: null };

  const sep = base.indexOf(" - ");
  if (sep > 0) {
    const artist = base.slice(0, sep).trim();
    const title = base.slice(sep + 3).trim();
    if (artist && title) return { title, artist };
  }
  return { title: base, artist: null };
}

export function matchesQuery(song, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    song.title.toLowerCase().includes(q) ||
    (song.artist ?? "").toLowerCase().includes(q)
  );
}

const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });

export const SORT_MODES = ["recent", "title", "artist"];

export const SORT_LABELS = {
  recent: "Recently added",
  title: "Title",
  artist: "Artist",
};

export function sortSongs(songs, mode) {
  const list = [...songs];
  switch (mode) {
    case "title":
      return list.sort((a, b) => collator.compare(a.title, b.title));
    case "artist":
      return list.sort(
        (a, b) =>
          collator.compare(a.artist ?? "￿", b.artist ?? "￿") ||
          collator.compare(a.title, b.title),
      );
    case "recent":
    default:
      return list.sort((a, b) => b.addedAt - a.addedAt);
  }
}
