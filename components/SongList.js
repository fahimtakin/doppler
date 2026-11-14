import React, { useCallback } from "react";
import { FlatList } from "react-native";
import SongItem, { SONG_ITEM_HEIGHT } from "./SongItem";

const getItemLayout = (_, index) => ({
  length: SONG_ITEM_HEIGHT,
  offset: SONG_ITEM_HEIGHT * index,
  index,
});

const keyExtractor = (item) => String(item.id);

export default function SongList({
  songs,
  currentSongId,
  onSongPress,
  onToggleFavorite,
  onMore,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
}) {
  const renderItem = useCallback(
    ({ item }) => (
      <SongItem
        song={item}
        isCurrent={item.id === currentSongId}
        onPress={onSongPress}
        onToggleFavorite={onToggleFavorite}
        onMore={onMore}
      />
    ),
    [currentSongId, onSongPress, onToggleFavorite, onMore],
  );

  return (
    <FlatList
      data={songs}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      extraData={currentSongId}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={contentContainerStyle}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      initialNumToRender={14}
      windowSize={11}
      removeClippedSubviews
    />
  );
}
