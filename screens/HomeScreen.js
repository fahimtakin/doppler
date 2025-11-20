import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import SearchBar from '../components/SearchBar';
import SongList from '../components/SongList';

const audioSource = require('../assets/song.mp3');


const HomeScreen = () => {
    const player = useAudioPlayer(audioSource);
    
  return (
    <View style={styles.container}>
    <SearchBar/>
    <SongList songs={[]} onSongPress={() => {}} />
     <Pressable style={styles.btn} onPress={() => {
        player.seekTo(0)
        // player.play()
        }}>
      <Text style={styles.btnText}>Click Meee</Text>
    </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
});

export default HomeScreen;