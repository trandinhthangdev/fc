import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Tts from 'react-native-tts';
import questions from '../../data/questions.json';
import LayoutApp from '../../components/layout/LayoutApp';

const ee = new NativeEventEmitter(NativeModules.TextToSpeech);
ee.addListener('tts-start', () => {});
ee.addListener('tts-finish', () => {});
ee.addListener('tts-cancel', () => {});

const Quiz = props => {
  const isFocused = useIsFocused();
  const [currentIndex, setCurrentIndex] = useState(null);
  const [point, setPoint] = useState(0);

  useEffect(() => {
    // if (isFocused) playVoice();
  }, [isFocused]);
  const text = 'Chúng ta cùng đi tìm : "Ai là Đóm Đóm"';
  const playVoice = () => {
    Tts.setDefaultLanguage('vi-VN');
    Tts.setDefaultVoice('vi-VN-language');
    if (Platform.OS === 'ios') {
      Tts.speak(text, {
        iosVoiceId: 'com.apple.voice.compact.vi-VN.Linh',
        rate: 0.6,
      });
    } else if (Platform.OS === 'android') {
      Tts.speak(text, {
        androidParams: {
          KEY_PARAM_PAN: 0,
          KEY_PARAM_VOLUME: 1,
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
    }
  };
  const question = currentIndex !== null ? questions[currentIndex] : null;
  return (
    <LayoutApp title={'Quiz'}>
      <View>
        {question ? (
          <View
            style={{
              width: '100%',
              paddingHorizontal: 20,
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              {question.question}
            </Text>
            <Text
              style={{
                color: '#fff',
              }}>
              {question.point}
            </Text>
            <View
              style={{
                marginBottom: 20,
              }}>
              {question.answers.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      padding: 10,
                      backgroundColor: 'rgba(255,245,205, 0.4)',
                      borderRadius: 10,
                      marginVertical: 10,
                    }}
                    onPress={() => {
                      console.log(question.correct_index, index);
                      if (question.correct_index === index) {
                        setPoint(prev => prev + question.point);
                      }
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                      }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {/* <TouchableOpacity
              style={styles.start_quiz_btn}
              onPress={() => setCurrentIndex(prev => prev + 1)}>
              <Text style={styles.start_quiz_btn_text}>Next</Text>
            </TouchableOpacity> */}
          </View>
        ) : (
          <>
            {/* <Image
              source={require('./../assets/jack.jpeg')}
              style={styles.logo}
            /> */}
            <Text style={styles.desc_text}>{text}</Text>
            <TouchableOpacity
              style={styles.start_quiz_btn}
              onPress={() => setCurrentIndex(0)}>
              <Text style={styles.start_quiz_btn_text}>Start quiz</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </LayoutApp>
  );
};

export default Quiz;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#040D12',
  },
  logo: {
    width: 240,
    height: 240,
    borderRadius: 120,
    marginBottom: 40,
  },
  desc_text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  start_quiz_btn: {
    backgroundColor: '#FFD35A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  start_quiz_btn_text: {
    fontWeight: 'bold',
    color: '#040D12',
    fontSize: 18,
  },
});
