import {useEffect, useRef, useState} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
function createRandomArray(length, n) {
  // Create an empty array
  let randomArray = [];

  // Fill the array with random numbers from 0 to n
  for (let i = 0; i < length; i++) {
    let randomNum = Math.floor(Math.random() * (n + 1));
    randomArray.push(randomNum);
  }

  return randomArray;
}
const VerticalPiano = props => {
  const [data, setData] = useState(createRandomArray(100, 3));
  const scrollViewRef = useRef();
  //   useEffect(() => {
  //     scrollViewRef.current?.scrollToEnd({animated: false});
  //   }, []);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [contentHeight, setContentHeight] = useState(null); // Store content height

  useEffect(() => {
    if (!contentHeight) return;
    let scrollInterval;

    if (isScrolling) {
      scrollInterval = setInterval(() => {
        setScrollY(prevY => {
          const newY = Math.max(prevY - 20, 0); // Scroll 10px up, ensure it doesn't go below 0
          scrollViewRef.current?.scrollTo({y: newY, animated: true});
          return newY;
        });
      }, 100); // 0.1 second interval
    }

    // Clear interval on component unmount or when scrolling stops
    return () => clearInterval(scrollInterval);
  }, [isScrolling, contentHeight]);
  useEffect(() => {
    startScrolling();
  }, []);

  //   const startScrolling = () => setIsScrolling(true);
  const startScrolling = () => {
    scrollViewRef.current?.scrollToEnd({animated: false}); // Start at the bottom
    // console.log(scrollViewRef.current?.contentSize?.height);
    // scrollViewRef.current?.scrollTo({ y: contentHeight, animated: false }); // Scroll to the bottom
    // setScrollY(contentHeight); // Set initial scrollY to the content height
    setIsScrolling(true);
  };

  const stopScrolling = () => setIsScrolling(false);
  console.log('scrollY', scrollY);
  return (
    <View style={{}}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          flexDirection: 'column-reverse',
          justifyContent: 'flex-end',
        }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        onContentSizeChange={(width, height) => {
          setContentHeight(height);
          setScrollY(height);
        }}>
        {data.map((item, index) => {
          return (
            <View
              style={{
                flexDirection: 'row',
              }}>
              {[0, 1, 2, 3].map(col => {
                if (col === item) {
                  return (
                    <View
                      style={{
                        height: 200,
                        flex: 1,
                        paddingVertical: 2,
                      }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: 'red',
                          width: '100%',
                          height: '100%',
                          padding: 10,
                          borderRadius: 10,
                        }}>
                        {index % 10 == 0 && (
                          <Image
                            style={{
                              width: '100%',
                              height: 120,
                              resizeMode: 'cover',
                            }}
                            source={{
                              uri: 'https://i.pinimg.com/564x/65/e6/29/65e629ecd8a30f5a94767f84b3c76aa6.jpg',
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                }
                return (
                  <View
                    style={{
                      height: 200,
                      flex: 1,
                      paddingVertical: 2,
                    }}></View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default VerticalPiano;
