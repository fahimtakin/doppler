import { formatTime, matchesQuery, parseFileName, sortSongs } from "../utils/format";

describe("formatTime", () => {
  it.each([
    [0, "0:00"],
    [5, "0:05"],
    [65.9, "1:05"],
    [3600, "1:00:00"],
    [3725, "1:02:05"],
    [-1, "0:00"],
    [NaN, "0:00"],
  ])("formats %p as %p", (input, expected) => {
    expect(formatTime(input)).toBe(expected);
  });
});

describe("parseFileName", () => {
  it("splits 'Artist - Title' and strips the extension", () => {
    expect(parseFileName("Daft Punk - One More Time.mp3")).toEqual({
      artist: "Daft Punk",
      title: "One More Time",
    });
  });

  it("handles names without an artist", () => {
    expect(parseFileName("my_cool_song.flac")).toEqual({ title: "my cool song", artist: null });
  });

  it("falls back for empty names", () => {
    expect(parseFileName("")).toEqual({ title: "Unknown title", artist: null });
    expect(parseFileName(undefined).title).toBe("Unknown title");
  });

  it("keeps leading dashes as part of the title", () => {
    expect(parseFileName(" - Intro.m4a").artist).toBeNull();
  });
});

describe("matchesQuery", () => {
  const song = { title: "Midnight Drive", artist: "Neon Horizon" };

  it("matches title or artist, case-insensitively", () => {
    expect(matchesQuery(song, "drive")).toBe(true);
    expect(matchesQuery(song, "NEON")).toBe(true);
    expect(matchesQuery(song, "jazz")).toBe(false);
  });

  it("matches everything for a blank query", () => {
    expect(matchesQuery(song, "   ")).toBe(true);
  });

  it("tolerates songs without an artist", () => {
    expect(matchesQuery({ title: "Solo", artist: null }, "x")).toBe(false);
  });
});

describe("sortSongs", () => {
  const songs = [
    { id: 1, title: "beta", artist: "Zed", addedAt: 1 },
    { id: 2, title: "Alpha", artist: null, addedAt: 3 },
    { id: 3, title: "track 10", artist: "Amy", addedAt: 2 },
    { id: 4, title: "track 2", artist: "Amy", addedAt: 4 },
  ];

  it("sorts by most recently added", () => {
    expect(sortSongs(songs, "recent").map((s) => s.id)).toEqual([4, 2, 3, 1]);
  });

  it("sorts by title with natural number order", () => {
    expect(sortSongs(songs, "title").map((s) => s.id)).toEqual([2, 1, 4, 3]);
  });

  it("sorts by artist, unknown artists last", () => {
    expect(sortSongs(songs, "artist").map((s) => s.id)).toEqual([4, 3, 1, 2]);
  });

  it("does not mutate the input", () => {
    const before = songs.map((s) => s.id);
    sortSongs(songs, "title");
    expect(songs.map((s) => s.id)).toEqual(before);
  });
});
