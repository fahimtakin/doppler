import * as DocumentPicker from "expo-document-picker";

export const scanSongs = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "audio/*",
      multiple: false,
    });

    if (result.type === "cancel" || result.canceled) {
      return [];
    }

   
    const file = result.assets?.[0] || result;

    const song = {
      id: file.uri || file.name, // fallback if uri missing
      title: file.name || "Unknown",
      uri: file.uri,
      duration: 0,
    };

    return [song];
  } catch (err) {
    console.error("Error picking song:", err);
    return [];
  }
};
