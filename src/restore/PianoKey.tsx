import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface PianoKeyProps {
  note: string;
  color: string;
  onPress: (note: string) => void;
}

const PianoKey: React.FC<PianoKeyProps> = ({note, color, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.key, {backgroundColor: color}]}
      onPress={() => onPress(note)}>
      <Text style={styles.noteText}>{note}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  key: {
    flex: 1,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteText: {
    color: 'black',
  },
});

export default PianoKey;
