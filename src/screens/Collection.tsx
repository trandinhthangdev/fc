import {useNavigation} from '@react-navigation/native';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {screenWidth} from '../utils/constants';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useTheme} from '../contexts/ThemeContext';
import AppIcon from '../components/common/AppIcon';
import CollectionGrid from '../components/Collection/CollectionGrid';

export enum ETabView {
  tab_all = 'tab_all',
  tab_favorite = 'tab_favorite',
}
const width = screenWidth / 2 - 20;
const Collection = () => {
  const {paletteColor} = useTheme();
  const [tabView, setTabView] = useState(ETabView.tab_all);
  const [loadingTabView, setLoadingTabView] = useState(false);

  const tabs = [
    {
      code: ETabView.tab_all,
      name: 'Tất cả',
      icon: (
        <AppIcon
          name={tabView === ETabView.tab_all ? 'grid' : 'grid-outline'}
          type="Ionicons"
          size={24}
          color={paletteColor.text}
        />
      ),
    },
    {
      code: ETabView.tab_favorite,
      name: 'Yêu thích',
      icon: (
        <AppIcon
          name={tabView === ETabView.tab_favorite ? 'heart' : 'heart-outline'}
          type="Ionicons"
          size={24}
          color={
            tabView === ETabView.tab_favorite ? '#EE66A6' : paletteColor.text
          }
        />
      ),
    },
  ];
  useEffect(() => {
    if (loadingTabView) setLoadingTabView(false);
  }, [loadingTabView]);

  return (
    <View
      style={{
        backgroundColor: paletteColor.bg,
        height: '100%',
      }}>
      <View style={{...styles.tab_list}}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.code}
            style={{
              ...styles.tab_item,
              borderBottomWidth: 1,
              ...(tab.code === ETabView.tab_favorite &&
              tabView === ETabView.tab_favorite
                ? {borderBottomColor: '#EE66A6'}
                : tab.code === ETabView.tab_all && tabView === ETabView.tab_all
                ? {
                    borderBottomColor: paletteColor.text,
                  }
                : {
                    borderBottomColor: 'transparent',
                  }),
            }}
            onPress={() => {
              setLoadingTabView(true);
              setTabView(tab.code);
            }}>
            {tab.icon}
            <Text
              style={{
                ...styles.tab_item_text,
                color: paletteColor.text,
                ...(tab.code === ETabView.tab_favorite &&
                tabView === ETabView.tab_favorite
                  ? {
                      color: '#EE66A6',
                    }
                  : {}),
              }}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {!loadingTabView && <CollectionGrid type={tabView} />}
    </View>
  );
};

export default Collection;
const styles = StyleSheet.create({
  container: {},
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
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: width,
    height: width * 1.5,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
