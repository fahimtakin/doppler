import React from 'react';
import { FlatList } from 'react-native';
import SongItem from './SongItem';

export default function SongList({ songs, onSongPress }) {
  return (
    <FlatList
      data={songs}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => <SongItem song={item} onPress={() => onSongPress(item)} />}
    />
  );
}