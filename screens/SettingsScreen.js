import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useLibrary } from "../context/LibraryContext";
import { usePlayer } from "../context/PlayerContext";
import { useImportSongs } from "../hooks/useImportSongs";
import { useSleepCountdown } from "../hooks/useSleepCountdown";
import { colors, radius, spacing } from "../theme";

const PRESETS = [5, 15, 30, 45, 60];
const MAX_MINUTES = 24 * 60;

function Row({ icon, label, detail, onPress, destructive, right }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && onPress && styles.rowPressed]}
      accessibilityRole={onPress ? "button" : undefined}
    >
      <Ionicons name={icon} size={20} color={destructive ? colors.danger : colors.textMuted} />
      <Text style={[styles.rowLabel, destructive && { color: colors.danger }]}>{label}</Text>
      {right ?? (detail ? <Text style={styles.rowDetail}>{detail}</Text> : null)}
    </Pressable>
  );
}

function Section({ title, children, footer }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
      {footer ? <Text style={styles.footer}>{footer}</Text> : null}
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { songs, removeSongs } = useLibrary();
  const { sleep, startSleepTimer, sleepAtEndOfTrack, cancelSleepTimer } = usePlayer();
  const { importSongs, importing } = useImportSongs();
  const sleepLabel = useSleepCountdown(sleep);
  const [custom, setCustom] = useState("");

  const sleepActive = Boolean(sleep.endsAt || sleep.endOfTrack);
  const favoriteCount = songs.filter((s) => s.isFavorite).length;

  const applyCustom = () => {
    const minutes = Number.parseInt(custom, 10);
    if (!Number.isFinite(minutes) || minutes <= 0 || minutes > MAX_MINUTES) {
      Alert.alert("Invalid time", `Enter a number of minutes between 1 and ${MAX_MINUTES}.`);
      return;
    }
    startSleepTimer(minutes);
    setCustom("");
  };

  const confirmClear = () => {
    Alert.alert(
      "Clear library?",
      `This removes all ${songs.length} songs and favorites from Doppler. Original files on your device are not affected.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear library",
          style: "destructive",
          onPress: () => removeSongs(songs.map((s) => s.id)),
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{ padding: spacing.lg, paddingBottom: insets.bottom + spacing.xxl }}
      keyboardShouldPersistTaps="handled"
    >
      <Section
        title="Sleep timer"
        footer={sleepActive ? sleepLabel : "Playback pauses automatically when the timer runs out."}
      >
        <View style={styles.presets}>
          {PRESETS.map((m) => (
            <Pressable
              key={m}
              onPress={() => startSleepTimer(m)}
              style={({ pressed }) => [styles.preset, pressed && styles.rowPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Stop in ${m} minutes`}
            >
              <Text style={styles.presetText}>{m}m</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.customRow}>
          <TextInput
            value={custom}
            onChangeText={(t) => setCustom(t.replace(/[^0-9]/g, ""))}
            placeholder="Custom minutes"
            placeholderTextColor={colors.textFaint}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.input}
            onSubmitEditing={applyCustom}
            returnKeyType="done"
            accessibilityLabel="Custom sleep timer in minutes"
          />
          <Pressable
            onPress={applyCustom}
            style={({ pressed }) => [styles.setButton, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
          >
            <Text style={styles.setButtonText}>Set</Text>
          </Pressable>
        </View>
        <Row icon="musical-note-outline" label="Stop after current song" onPress={sleepAtEndOfTrack} />
        {sleepActive && (
          <Row icon="close-circle-outline" label="Turn off sleep timer" onPress={cancelSleepTimer} destructive />
        )}
      </Section>

      <Section title="Library">
        <Row icon="albums-outline" label="Songs" detail={String(songs.length)} />
        <Row icon="heart-outline" label="Favorites" detail={String(favoriteCount)} />
        <Row
          icon="add-circle-outline"
          label="Add songs from device"
          onPress={importing ? undefined : importSongs}
          right={importing ? <ActivityIndicator color={colors.accent} /> : null}
        />
        {songs.length > 0 && (
          <Row icon="trash-outline" label="Clear library" onPress={confirmClear} destructive />
        )}
      </Section>

      <Section title="About">
        <Row
          icon="information-circle-outline"
          label="Version"
          detail={Constants.expoConfig?.version ?? "—"}
        />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  footer: {
    color: colors.textFaint,
    fontSize: 13,
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  rowPressed: {
    backgroundColor: colors.surfaceRaised,
  },
  rowLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },
  rowDetail: {
    color: colors.textMuted,
    fontSize: 15,
  },
  presets: {
    flexDirection: "row",
    padding: spacing.md,
    gap: spacing.sm,
  },
  preset: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
  },
  presetText: {
    color: colors.text,
    fontWeight: "600",
  },
  customRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: spacing.md,
    color: colors.text,
    fontSize: 15,
  },
  setButton: {
    height: 44,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  setButtonText: {
    color: "#000",
    fontWeight: "700",
  },
});
