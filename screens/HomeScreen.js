import React, { useCallback, useDeferredValue, useLayoutEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../components/SearchBar";
import SongList from "../components/SongList";
import MiniPlayer, { MINI_PLAYER_HEIGHT } from "../components/MiniPlayer";
import EmptyState from "../components/EmptyState";
import IconButton from "../components/IconButton";
import { useLibrary } from "../context/LibraryContext";
import { usePlayer } from "../context/PlayerContext";
import { useImportSongs } from "../hooks/useImportSongs";
import { colors, radius, spacing } from "../theme";
import { SORT_LABELS, SORT_MODES, matchesQuery, sortSongs } from "../utils/format";

const TABS = [
  { key: "all", label: "All songs" },
  { key: "favorites", label: "Favorites" },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { songs, hydrated, toggleFavorite, removeSongs } = useLibrary();
  const { currentSong, playFromList } = usePlayer();
  const { importSongs, importing } = useImportSongs();

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [sortMode, setSortMode] = useState("recent");
  const deferredQuery = useDeferredValue(query);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerActions}>
          {importing ? (
            <ActivityIndicator color={colors.accent} style={styles.headerSpinner} />
          ) : (
            <IconButton name="add" size={26} onPress={importSongs} label="Add songs" />
          )}
          <IconButton
            name="settings-outline"
            size={22}
            onPress={() => navigation.navigate("Settings")}
            label="Settings"
          />
        </View>
      ),
    });
  }, [navigation, importSongs, importing]);

  const visibleSongs = useMemo(() => {
    const base = tab === "favorites" ? songs.filter((s) => s.isFavorite) : songs;
    return sortSongs(base.filter((s) => matchesQuery(s, deferredQuery)), sortMode);
  }, [songs, tab, deferredQuery, sortMode]);

  const handleSongPress = useCallback(
    (song) => {
      playFromList(
        song.id,
        visibleSongs.map((s) => s.id),
      );
    },
    [playFromList, visibleSongs],
  );

  const handleMore = useCallback(
    (song) => {
      Alert.alert(song.title, song.artist ?? undefined, [
        {
          text: song.isFavorite ? "Remove from favorites" : "Add to favorites",
          onPress: () => toggleFavorite(song.id),
        },
        {
          text: "Remove from library",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Remove song?",
              `"${song.title}" will be deleted from Doppler. The original file on your device is not affected.`,
              [
                { text: "Cancel", style: "cancel" },
                { text: "Remove", style: "destructive", onPress: () => removeSongs([song.id]) },
              ],
            ),
        },
        { text: "Cancel", style: "cancel" },
      ]);
    },
    [toggleFavorite, removeSongs],
  );

  const cycleSort = useCallback(() => {
    setSortMode((m) => SORT_MODES[(SORT_MODES.indexOf(m) + 1) % SORT_MODES.length]);
  }, []);

  if (!hydrated) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (songs.length === 0) {
    return (
      <View style={styles.screen}>
        <EmptyState
          icon="musical-notes-outline"
          title="Your library is empty"
          message="Add audio files from your device to start listening. They'll stay here even when offline."
          actionLabel={importing ? "Importing…" : "Add songs"}
          onAction={importing ? undefined : importSongs}
        />
      </View>
    );
  }

  const header = (
    <View style={styles.header}>
      <SearchBar value={query} onChangeText={setQuery} />
      <View style={styles.toolbar}>
        <View style={styles.tabs} accessibilityRole="tablist">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <Pressable
                key={t.key}
                onPress={() => setTab(t.key)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          onPress={cycleSort}
          style={styles.sort}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Sort by ${SORT_LABELS[sortMode]}. Tap to change.`}
        >
          <Ionicons name="swap-vertical" size={16} color={colors.textMuted} />
          <Text style={styles.sortText}>{SORT_LABELS[sortMode]}</Text>
        </Pressable>
      </View>
    </View>
  );

  const empty =
    query.trim().length > 0 ? (
      <EmptyState icon="search" title="No matches" message={`Nothing found for "${query.trim()}".`} />
    ) : (
      <EmptyState
        icon="heart-outline"
        title="No favorites yet"
        message="Tap the heart on any song to save it here."
      />
    );

  const bottomPad = (currentSong ? MINI_PLAYER_HEIGHT + spacing.lg : 0) + insets.bottom + spacing.lg;

  return (
    <View style={styles.screen}>
      <SongList
        songs={visibleSongs}
        currentSongId={currentSong?.id}
        onSongPress={handleSongPress}
        onToggleFavorite={toggleFavorite}
        onMore={handleMore}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        contentContainerStyle={{ paddingBottom: bottomPad }}
      />
      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerSpinner: {
    width: 44,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  tabs: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#000",
  },
  sort: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
