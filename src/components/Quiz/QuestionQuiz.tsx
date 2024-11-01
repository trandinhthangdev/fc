import {useEffect, useRef, useState} from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import ProgressBar from '../common/ProgressBar';
import {usePlaySound} from '../../hooks/usePlaySound';

const TIME_PER_QUESTION = 10;
const QuestionQuiz = ({
  currentIndex,
  question,
  onNextQuestion,
}: {
  currentIndex: number | null;
  question: any;
  onNextQuestion: (check: boolean) => void;
}) => {
  const {playSound: playSongCorrect} = usePlaySound('correct.mp3');
  const {playSound: playSongWrong} = usePlaySound('wrong.mp3');
  const {paletteColor} = useTheme();
  const [timeRemain, setTimeRemain] = useState<number | null>(null);
  const [choiceIndex, setChoiceIndex] = useState(null);
  useEffect(() => {
    if (choiceIndex === null) setTimeRemain(TIME_PER_QUESTION);
    let interval = setInterval(() => {
      setTimeRemain(prev =>
        prev === null ? TIME_PER_QUESTION : prev - 1 >= 0 ? prev - 1 : 0,
      );
    }, 1000);
    if (choiceIndex !== null) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [question, choiceIndex]);
  useEffect(() => {
    if (choiceIndex !== null) {
      const isCorrect = question.correct_index === choiceIndex;
      if (isCorrect) {
        playSongCorrect();
      } else {
        playSongWrong();
      }
      setTimeout(() => {
        onNextQuestion(isCorrect);
        setChoiceIndex(null);
      }, 500);
    }
  }, [choiceIndex]);
  useEffect(() => {
    if (timeRemain === 0) {
      onNextQuestion(false);
      setChoiceIndex(null);
    }
  }, [timeRemain]);
  const position = useRef(new Animated.ValueXY({x: 0, y: 0})).current;

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
      }}>
      {timeRemain !== null && (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            marginBottom: 16,
          }}>
          <ProgressBar progress={(100 * timeRemain) / TIME_PER_QUESTION} />
          <Text
            style={{
              color: paletteColor.text,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {timeRemain}s
          </Text>
        </View>
      )}

      <Text
        style={{
          color: paletteColor.text,
          textAlign: 'center',

          fontSize: 14,
        }}>
        <Text
          style={{
            marginRight: 10,
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          Q{currentIndex + 1}:
        </Text>
        {` ${question.question} `}
        <Text
          style={{
            fontWeight: 'bold',
          }}>
          ({question.point})
        </Text>
      </Text>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}>
        {question.answers.map((item, index) => {
          const isCorrect = question.correct_index === choiceIndex;
          return (
            <TouchableOpacity
              disabled={choiceIndex !== null || timeRemain === 0}
              key={index}
              style={{
                padding: 16,
                backgroundColor: '#F5EFFF',
                borderRadius: 40,
                marginVertical: 8,
                width: '100%',
                maxWidth: 480,
                ...(isCorrect
                  ? choiceIndex === index
                    ? {
                        backgroundColor: '#DEF9C4',
                      }
                    : {}
                  : choiceIndex === index
                  ? {
                      backgroundColor: '#FFCFB3',
                    }
                  : {}),
              }}
              onPress={() => {
                setChoiceIndex(index);
              }}>
              <Text
                style={{
                  color: '#640D5F',
                  fontWeight: 600,
                  ...(isCorrect
                    ? choiceIndex === index
                      ? {
                          color: '#347928',
                        }
                      : {}
                    : choiceIndex === index
                    ? {
                        color: '#C7253E',
                      }
                    : {}),
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default QuestionQuiz;
