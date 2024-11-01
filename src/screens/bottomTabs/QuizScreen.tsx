import {useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  Image,
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
import {useTheme} from '../../contexts/ThemeContext';
import QuestionQuiz from '../../components/Quiz/QuestionQuiz';
import AppIcon from '../../components/common/AppIcon';
import {useSendMessage} from '../../hooks/useSendMessage';

const ee = new NativeEventEmitter(NativeModules.TextToSpeech);
ee.addListener('tts-start', () => {});
ee.addListener('tts-finish', () => {});
ee.addListener('tts-cancel', () => {});

const QuizScreen = props => {
  const isFocused = useIsFocused();
  const [currentIndex, setCurrentIndex] = useState(null);
  const [point, setPoint] = useState(0);
  const {paletteColor} = useTheme();
  const [isStop, setIsStop] = useState(false);
  const {onSendQuiz} = useSendMessage();

  const text = 'Chúng ta cùng đi tìm : "Ai là Đóm Đóm"';

  const question = currentIndex !== null ? questions[currentIndex] : null;
  return (
    <LayoutApp
      title={'Quiz'}
      customStyle={{
        position: 'relative',
      }}
      left={
        currentIndex !== null && point ? (
          <View
            style={{
              backgroundColor: '#640D5F',
              paddingVertical: 0,
              paddingHorizontal: 8,
              borderRadius: 16,
            }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
              }}>
              {point}
            </Text>
          </View>
        ) : undefined
      }>
      <View
        style={{
          height: '100%',
          width: '100%',
        }}>
        {isStop ? (
          <View
            style={{
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: paletteColor.text,
              }}>
              Chúng ta cùng đi tìm :{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                }}>
                "Ai là Đóm Đóm"
              </Text>
            </Text>
            <Image
              source={require('./../../assets/quiz.png')}
              style={{
                width: 150,
                height: 150,
                marginVertical: 16,
              }}
            />
            <Image
              source={require('./../../assets/clapping.png')}
              style={{
                width: 48,
                height: 48,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: paletteColor.text,
                marginVertical: 8,
              }}>
              Điểm bạn đạt được:{' '}
              <Text
                style={{
                  fontWeight: 'bold',
                }}>
                {point}
              </Text>
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 16,
                marginVertical: 16,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#BC5A94',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 40,
                  width: 120,
                }}
                onPress={() => onSendQuiz(point)}>
                <AppIcon
                  name={'send'}
                  type="FontAwesome"
                  size={24}
                  color={'#fff'}
                />
                <Text
                  style={{
                    color: '#fff',
                    marginTop: 4,
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Cộng đồng fan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#BC5A94',
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 40,
                  width: 120,
                }}>
                <AppIcon
                  name={'share-social'}
                  type="Ionicons"
                  size={24}
                  color={paletteColor.bg}
                />
                <Text
                  style={{
                    color: '#fff',
                    marginTop: 4,
                    fontSize: 12,
                    textAlign: 'center',
                  }}>
                  Chia sẻ
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#D4BEE4',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
              }}
              onPress={() => {
                setIsStop(false);
                setCurrentIndex(0);
                setPoint(0);
              }}>
              <Text
                style={{
                  color: '#3B1E54',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                bắt đầu lại
              </Text>
            </TouchableOpacity>
          </View>
        ) : question ? (
          <QuestionQuiz
            currentIndex={currentIndex}
            question={question}
            onNextQuestion={check => {
              if (check) {
                setPoint(prev => prev + question.point);
                setCurrentIndex(prev => prev + 1);
              } else {
                setIsStop(true);
                setCurrentIndex(null);
              }
            }}
          />
        ) : (
          <View
            style={{
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                marginBottom: 20,
                color: paletteColor.text,
              }}>
              {text}
            </Text>
            <Image
              source={require('./../../assets/quiz.png')}
              style={{
                width: 150,
                height: 150,
                marginVertical: 16,
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#D4BEE4',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
              }}
              onPress={() => setCurrentIndex(0)}>
              <Text
                style={{
                  color: '#3B1E54',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                Start quiz
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </LayoutApp>
  );
};

export default QuizScreen;
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
