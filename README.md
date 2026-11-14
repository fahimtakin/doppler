# Doppler

An offline music player for your own audio files, built with Expo (SDK 54) and React Native.

## Features

- **Library**: import audio files from the device. Files are copied into app storage, so they survive cache clears and app restarts. Duplicates are skipped.
- **Search, filter, sort**: search by title or artist, switch between All and Favorites, and sort by recently added, title, or artist.
- **Playback**: queue built from the list you tapped, shuffle, repeat (off / all / one), and smart previous (restarts the song if more than 3s in).
- **Background audio**: keeps playing when the app is backgrounded or the screen is locked. Lock screen and notification controls are included.
- **Sleep timer**: presets, a custom duration, or "stop after this song", with a live countdown.
- **Persistence**: library, favorites, shuffle/repeat, and the last played song are restored on launch.
- **Accessibility**: labelled controls, 44pt touch targets, and screen-reader hints.

## Getting started

```bash
npm install
npm start          # Expo dev server
npm run android    # open on an Android device/emulator
npm test           # unit tests
npm run doctor     # validate dependencies and config
```

Background playback and lock-screen controls need a development build
(`npx expo run:android` or EAS Build). Expo Go doesn't support them fully.

## Project structure

```
App.js                 Navigation, providers, error boundary
context/
  LibraryContext.js    Songs + favorites, persisted to AsyncStorage
  PlayerContext.js     Queue, playback, shuffle/repeat, sleep timer, lock screen
services/
  audioFiles.js        File picking, copying into app storage, deletion
  storage.js           JSON read/write helpers over AsyncStorage
hooks/                 useImportSongs, useSleepCountdown
utils/                 Pure, unit-tested helpers (queue logic, formatting)
components/            UI building blocks (MiniPlayer, SongItem, ProgressBar, ...)
screens/               Home, Player, Settings
theme/                 Colors, spacing, navigation theme
__tests__/             Jest tests
```

## Building for release

```bash
npm install -g eas-cli
eas build --platform android
```

Before publishing, update `android.package` / `ios.bundleIdentifier` in `app.json`
if `com.fahimtakin.doppler` isn't the ID you want, and bump `version` and
`android.versionCode` for each release.
