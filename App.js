import React from "react";
import { StatusBar } from "expo-status-bar";
import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ErrorBoundary from "./components/ErrorBoundary";
import { LibraryProvider } from "./context/LibraryContext";
import { PlayerProvider } from "./context/PlayerContext";
import HomeScreen from "./screens/HomeScreen";
import PlayerScreen from "./screens/PlayerScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { colors, navigationTheme } from "./theme";

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerStyle: { backgroundColor: colors.background },
    headerTintColor: colors.text,
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colors.background },
  },
  screens: {
    Home: {
      screen: HomeScreen,
      options: { title: "Doppler", headerTitleStyle: { fontWeight: "700" } },
    },
    Player: {
      screen: PlayerScreen,
      options: {
        headerShown: false,
        presentation: "fullScreenModal",
        animation: "slide_from_bottom",
        gestureEnabled: true,
      },
    },
    Settings: {
      screen: SettingsScreen,
      options: { title: "Settings" },
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <LibraryProvider>
          <PlayerProvider>
            <StatusBar style="light" />
            <Navigation theme={navigationTheme} />
          </PlayerProvider>
        </LibraryProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
