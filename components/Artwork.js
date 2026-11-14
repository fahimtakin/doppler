import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radius } from "../theme";

const PALETTE = [
  ["#3A1C71", "#D76D77"],
  ["#0F2027", "#2C5364"],
  ["#134E5E", "#71B280"],
  ["#42275A", "#734B6D"],
  ["#1F1C2C", "#928DAB"],
  ["#2C3E50", "#4CA1AF"],
  ["#4B1248", "#F0C27B"],
  ["#232526", "#414345"],
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Generated cover: a stable two-tone tile derived from the song id. */
function Artwork({ seed = "", size = 48, rounded = radius.sm }) {
  const [base, accent] = PALETTE[hash(String(seed)) % PALETTE.length];
  return (
    <View
      style={[styles.tile, { width: size, height: size, borderRadius: rounded, backgroundColor: base }]}
      accessible={false}
    >
      <View
        style={[
          styles.glow,
          {
            width: size * 1.1,
            height: size * 1.1,
            borderRadius: size,
            backgroundColor: accent,
            right: -size * 0.45,
            bottom: -size * 0.45,
          },
        ]}
      />
      <Ionicons name="musical-notes" size={size * 0.42} color="rgba(255,255,255,0.85)" />
    </View>
  );
}

export default memo(Artwork);

const styles = StyleSheet.create({
  tile: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    opacity: 0.55,
  },
});
