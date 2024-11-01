import {useNavigation, useRoute} from '@react-navigation/native';
import {Animated, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  COLLECTION_PHOTO_URL,
  ScreenName,
  screenWidth,
} from '../../utils/constants';
import {useCollection} from '../../hooks/useCollection';
import {useEffect, useMemo, useRef} from 'react';
import {
  Photo,
  updatePhotoCollection,
} from '../../redux/features/collectionSlice';
import {useTheme} from '../../contexts/ThemeContext';
import {useDispatch} from 'react-redux';
import FastImage from 'react-native-fast-image';

export enum ETabView {
  tab_all = 'tab_all',
  tab_favorite = 'tab_favorite',
}
const width = screenWidth / 2 - 20;
interface CollectionGridProps {
  type: ETabView;
  onPressPhoto?: (photo: Photo) => void;
}
const CollectionGrid = ({type, onPressPhoto}: CollectionGridProps) => {
  const route = useRoute();
  const {paletteColor} = useTheme();
  const scrollRef = useRef<ScrollView>(null);
  const dispatch = useDispatch();
  const {
    pages,
    collection: collectionState,
    loadMore,
    isLoading,
  } = useCollection({type});
  const navigation = useNavigation();
  const onShowPhotoPreview = item => {
    if (onPressPhoto) {
      onPressPhoto(item);
      return;
    }
    navigation.navigate(ScreenName.PhotoPreviewScreen, {
      item,
    });
  };
  const collection = useMemo(() => {
    if (type === ETabView.tab_all) return collectionState;
    return collectionState.filter(item => !!item.loved_at);
  }, [collectionState]);
  const handleScroll = (event: any) => {
    const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isAtBottom && !isLoading) {
      loadMore();
    }
  };
  const {first, second} = useMemo(() => {
    let firstCol: Photo[] = [];
    let secondCol: Photo[] = [];
    collection.forEach(photo => {
      const totalRatioFirst = firstCol.reduce((acc, photo) => {
        return acc + photo.height / photo.width;
      }, 0);
      const totalRatioSecond = secondCol.reduce((acc, photo) => {
        return acc + photo.height / photo.width;
      }, 0);
      if (totalRatioSecond >= totalRatioFirst) {
        firstCol = [...firstCol, photo];
      } else {
        secondCol = [...secondCol, photo];
      }
    });
    return {
      first: firstCol,
      second: secondCol,
    };
  }, [collection]);
  const firstSkeleton = [1.6, 1.9, 1.2, 0.8, 1.8, 1.3, 0.9, 1.2, 1.4, 0.8];
  const secondSkeleton = [1.8, 0.7, 1.4, 1.6, 0.7, 1.1, 1.4, 1.5, 1.6, 0.9];
  // console.log('refreshing', refreshing);
  return (
    <ScrollView
      style={{
        ...styles.container,
        backgroundColor: paletteColor.bg,
      }}
      ref={scrollRef}
      onScroll={handleScroll}>
      {collection.length === 0 && !isLoading && (
        <View style={styles.no_data}>
          <Text
            style={{
              ...styles.no_data_text,
              color: paletteColor.text,
            }}>
            Không có dữ liệu
          </Text>
        </View>
      )}
      <View style={styles.row}>
        <View style={styles.col}>
          {collection.length === 0 && isLoading && (
            <>
              {firstSkeleton.map((ratio, index) => (
                <Animated.View
                  key={index}
                  style={{...styles.skeleton, height: width * ratio}}
                />
              ))}
            </>
          )}
          {first.map(item => {
            return (
              <TouchableOpacity
                key={item.url}
                style={styles.photo_item}
                onPress={() => {
                  onShowPhotoPreview(item);
                }}>
                <FastImage
                  source={{
                    uri: COLLECTION_PHOTO_URL.replace('PHOTO_ID', item.url),
                  }}
                  style={{
                    width: width,
                    height: (width * item.height) / item.width,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
          })}
          {isLoading && <Animated.View style={[styles.skeleton]} />}
        </View>
        <View style={styles.col}>
          {collection.length === 0 && isLoading && (
            <>
              {secondSkeleton.map((ratio, index) => (
                <Animated.View
                  key={index}
                  style={{...styles.skeleton, height: width * ratio}}
                />
              ))}
            </>
          )}
          {second.map(item => {
            return (
              <TouchableOpacity
                key={item.url}
                style={styles.photo_item}
                onPress={() => {
                  onShowPhotoPreview(item);
                }}>
                <FastImage
                  source={{
                    uri: COLLECTION_PHOTO_URL.replace('PHOTO_ID', item.url),
                  }}
                  style={{
                    width: width,
                    height: (width * item.height) / item.width,
                  }}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            );
          })}
          {isLoading && <Animated.View style={[styles.skeleton]} />}
        </View>
      </View>
    </ScrollView>
  );
};

export default CollectionGrid;
const styles = StyleSheet.create({
  tab_list: {
    flexDirection: 'row',
  },
  tab_item: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab_item_text: {
    marginLeft: 5,
    fontWeight: 'bold',
  },
  container: {
    // height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  photo_item: {
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  skeleton: {
    backgroundColor: '#e0e0e0',
    width: width,
    height: width * 1.5,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  no_data: {
    padding: 10,
  },
  no_data_text: {
    textAlign: 'center',
    fontWeight: 300,
  },
});
