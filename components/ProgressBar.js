import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { colors, spacing } from "../theme";
import { formatTime } from "../utils/format";

/**
 * Seek bar. While the user drags, it shows the drag position instead of the
 * live position so the thumb doesn't jump back under their finger.
 */
export default function ProgressBar({ position, duration, onSeek }) {
  const [scrubValue, setScrubValue] = useState(null);
  const max = duration > 0 ? duration : 1;
  const shown = scrubValue ?? Math.min(position, max);

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={max}
        value={shown}
        disabled={!(duration > 0)}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.text}
        onValueChange={setScrubValue}
        onSlidingComplete={(v) => {
          onSeek(v);
          setScrubValue(null);
        }}
        accessibilityLabel="Seek"
        accessibilityValue={{ text: `${formatTime(shown)} of ${formatTime(duration)}` }}
      />
      <View style={styles.times}>
        <Text style={styles.time}>{formatTime(shown)}</Text>
        <Text style={styles.time}>
          {duration > 0 ? `-${formatTime(Math.max(0, duration - shown))}` : "--:--"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  times: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xs,
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
    fontVariant: ["tabular-nums"],
  },
});
