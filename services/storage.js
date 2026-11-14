import AsyncStorage from "@react-native-async-storage/async-storage";

export const KEYS = {
  library: "doppler/library/v1",
  playerPrefs: "doppler/player/v1",
};

export async function readJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch (err) {
    console.warn(`[storage] failed to read ${key}`, err);
    return fallback;
  }
}

export async function writeJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[storage] failed to write ${key}`, err);
  }
}
