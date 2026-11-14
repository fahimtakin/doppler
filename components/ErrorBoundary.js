import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../theme";

/** Catches render errors so a bug shows a recovery screen instead of a blank app. */
export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Hook a crash reporter (Sentry, Bugsnag, ...) in here.
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.message}>
          Doppler hit an unexpected error. Your library is safe.
        </Text>
        {__DEV__ && <Text style={styles.detail}>{String(this.state.error?.message)}</Text>}
        <Pressable onPress={this.reset} style={styles.button} accessibilityRole="button">
          <Text style={styles.buttonText}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
  },
  title: { fontSize: 20, fontWeight: "700", color: colors.text },
  message: { fontSize: 15, color: colors.textMuted, textAlign: "center", marginTop: spacing.sm },
  detail: { fontSize: 12, color: colors.danger, marginTop: spacing.lg, textAlign: "center" },
  button: {
    marginTop: spacing.xl,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  buttonText: { color: "#000", fontWeight: "700" },
});
