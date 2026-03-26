import * as DocumentPicker from "expo-document-picker";

export const scanSongs = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      multiple: true,
    });

    if (result.canceled) {
      return [];
    }

    const songs = (result.assets || []).map((file) => ({
      id: file.uri || file.name,
      title: file.name || "Unknown",
      uri: file.uri,
      duration: 0,
    }));

    return songs;
  } catch (err) {
    console.error("Error picking song:", err);
    return [];
  }
};
