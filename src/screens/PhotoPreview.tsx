import {Animated, StyleSheet, View, TouchableOpacity} from 'react-native';
import {screenHeight, screenWidth} from '../utils/constants';
import {useEffect, useRef, useState} from 'react';
import AppIcon from '../components/common/AppIcon';
import {useNavigation} from '@react-navigation/native';
import db from './../db/Database';
import {Photo} from '../redux/features/collectionSlice';
import {useTheme} from '../contexts/ThemeContext';
import PhotoView from '../components/Collection/PhotoView';

const PhotoPreview = ({route}) => {
  const {paletteColor} = useTheme();
  const navigation = useNavigation();
  const {item, onRefreshPhoto} = route.params;
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [items, setItems] = useState([item]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);

  const loadMore = async (nbPages: number) => {
    setIsLoading(true);
    const data = await db.getRandomPhotos(
      nbPages ?? 10,
      items.map(item => item.url),
    );
    setItems(prev => [...prev, ...data]);
    setIsLoading(false);
    if (data.length < (nbPages ?? 10)) {
      setIsEnd(true);
    }
  };
  useEffect(() => {
    loadMore(9);
  }, []);
  const handleScroll = event => {
    Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
      useNativeDriver: false,
    });
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor((contentOffsetX + 1) / screenWidth);
    if (Math.ceil((index + 5) / 10) > page && !isLoading && !isEnd) {
      setPage(prev => prev + 1);
    }
  };
  useEffect(() => {
    if (page > 1) {
      loadMore(10);
    }
  }, [page]);
  return (
    <View
      style={{
        padding: 5,
        height: '100%',
        width: screenWidth,
        position: 'relative',
      }}>
      <TouchableOpacity
        style={{
          ...styles.back_btn,
          backgroundColor: paletteColor.text,
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <AppIcon
          name="arrow-back"
          type="Ionicons"
          size={24}
          color={paletteColor.bg}
        />
      </TouchableOpacity>
      <Animated.ScrollView
        ref={scrollViewRef}
        scrollEventThrottle={16}
        onScroll={event => handleScroll(event)}
        horizontal
        pagingEnabled
        style={{
          width: screenWidth,
          height: screenHeight,
        }}
        showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => {
          return (
            <PhotoView
              key={index}
              photo={item}
              onRefreshPhoto={onRefreshPhoto}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default PhotoPreview;

const styles = StyleSheet.create({
  container: {
    padding: 5,
    height: '100%',
    width: screenWidth,
    position: 'relative',
  },
  // layer: {
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   width: '100%',
  //   height: '100%',
  //   alignItems: 'flex-start',
  //   padding: 10,
  //   // zIndex: 8,
  // },
  back_btn: {
    paddingVertical: 2,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 999,
    elevation: 999,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    zIndex: 99999,
  },
  action_bar: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    padding: 10,
    borderRadius: 30,
    zIndex: 999,
    elevation: 999,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  action_btn: {
    alignItems: 'center',
  },
  action_btn_text: {
    fontSize: 12,
  },
});
