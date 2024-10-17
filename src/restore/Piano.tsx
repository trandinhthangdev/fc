import React from 'react';
import {View, StyleSheet} from 'react-native';
import PianoKey from './PianoKey';

const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];

const Piano: React.FC = () => {
  const handleKeyPress = (note: string) => {
    console.log(`Key pressed: ${note}`);
    // Here you can add the logic to play the sound corresponding to the note
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteKeys}>
        {whiteKeys.map(note => (
          <PianoKey
            key={note}
            note={note}
            color="white"
            onPress={handleKeyPress}
          />
        ))}
      </View>
      <View style={styles.blackKeys}>
        {blackKeys.map((note, index) => (
          <View key={note} style={styles.blackKeyWrapper}>
            {index === 2 ? null : ( // Skip a position for F# key
              <PianoKey note={note} color="black" onPress={handleKeyPress} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 200,
    margin: 10,
  },
  whiteKeys: {
    flexDirection: 'row',
    flex: 1,
  },
  blackKeys: {
    flexDirection: 'row',
    position: 'absolute',
    left: '10%',
    top: 0,
    right: '10%',
    bottom: 0,
    justifyContent: 'space-between',
  },
  blackKeyWrapper: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Piano;
