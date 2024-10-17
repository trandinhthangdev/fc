import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from '../../contexts/ThemeContext';

const ScriptRunning = ({currentTime, onSliderValueChange, code}) => {
  const {paletteColor} = useTheme();
  const itemRefs = useRef([]);
  const scrollViewRef = useRef();
  const [scrollHeight, setScrollHeight] = useState(0);
  const [heights, setHeights] = useState([]);
  const [transcripts, setTranscripts] = useState([]);
  const link = `https://res.cloudinary.com/dxdbwpnnd/raw/upload/v1727587349/jack/scripts/${code}.json`;

  useEffect(() => {
    if (transcripts.length === 0)
      axios.get(link).then(res => {
        if (Array.isArray(res.data)) setTranscripts(res.data);
      });
  }, []);
  const setItemHeight = (index, height) => {
    setHeights(prevHeights => {
      const newHeights = [...prevHeights];
      newHeights[index] = height;
      return newHeights;
    });
  };
  useEffect(() => {
    const index = transcripts.findLastIndex(
      item =>
        currentTime * 1000 >= item.startTime - 200 &&
        currentTime * 1000 <= item.endTime + 200,
    );
    // console.log('index', index);
    if (index !== -1) scrollToIndex(index);
  }, [currentTime]);

  const scrollToIndex = index => {
    const scrollPosition = heights
      .slice(0, index)
      .reduce((total, height) => total + height, 0);
    scrollViewRef.current?.scrollTo({
      y: scrollPosition,
      animated: true,
    });
  };
  return (
    <ScrollView
      style={{
        width: '100%',
      }}
      contentContainerStyle={{
        alignItems: 'center',
      }}
      ref={scrollViewRef}
      onLayout={event => {
        const {height} = event.nativeEvent.layout;
        setScrollHeight(height);
      }}>
      {transcripts.map((transcript, index) => {
        return (
          <TouchableOpacity
            key={index}
            ref={ref => (itemRefs.current[index] = ref)}
            onPress={() => {
              onSliderValueChange(transcript.startTime / 1000);
            }}
            onLayout={event => {
              const {height} = event.nativeEvent.layout;
              setItemHeight(index, height);
            }}>
            <Text
              style={{
                color: paletteColor.text,
                fontSize: 16,
                marginVertical: 2,
                paddingVertical: 2,
                ...(currentTime * 1000 >= transcript.startTime - 500 &&
                currentTime * 1000 <= transcript.endTime + 200
                  ? {
                      fontWeight: 'bold',
                    }
                  : {}),
              }}>
              {transcript.text}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default ScriptRunning;
