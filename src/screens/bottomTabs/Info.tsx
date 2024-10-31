import {
  Linking,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useTheme} from '../../contexts/ThemeContext';
import info from './../../data/info.json';
import AppIcon from '../../components/common/AppIcon';
import {ScrollView} from 'react-native-gesture-handler';
import LayoutApp from '../../components/layout/LayoutApp';
import {useTranslation} from 'react-i18next';
const Info = props => {
  const {t} = useTranslation();
  const {themeColor, paletteColor} = useTheme();
  const openLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {}
  };
  return (
    <LayoutApp title={t('tab.info')}>
      <View
        style={{
          ...styles.container,
          backgroundColor: paletteColor.bg,
        }}>
        <ScrollView>
          <View style={styles[`${themeColor}_wrapper`]}>
            <Image
              source={require('./../../assets/jack.jpeg')}
              style={styles.avatar}
            />
            {/* <View style={styles.social_wrapper}>
              {Array.isArray(info.socials) && (
                <>
                  {info.socials.map((social, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={styles.social_btn}
                        onPress={() => openLink(social.link)}>
                        {social.type === 'facebook' && (
                          <AppIcon
                            type="Ionicons"
                            name="logo-facebook"
                            size={24}
                            color={paletteColor.text}
                          />
                        )}
                        {social.type === 'fanpage' && (
                          <AppIcon
                            type="Ionicons"
                            name="logo-facebook"
                            size={24}
                            color={paletteColor.text}
                          />
                        )}
                        {social.type === 'youtube' && (
                          <AppIcon
                            type="Ionicons"
                            name="logo-youtube"
                            size={24}
                            color={paletteColor.text}
                          />
                        )}
                        {social.type === 'tiktok' && (
                          <AppIcon
                            type="Ionicons"
                            name="logo-tiktok"
                            size={24}
                            color={paletteColor.text}
                          />
                        )}
                        {social.type === 'instagram' && (
                          <AppIcon
                            type="Ionicons"
                            name="logo-instagram"
                            size={24}
                            color={paletteColor.text}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </View> */}

            {Array.isArray(info.sections) && (
              <View style={styles.sections}>
                {info.sections.map((section, index) => {
                  return (
                    <View key={index} style={styles.section_item}>
                      <Text
                        style={{
                          ...styles.section_item_title_text,
                          color: paletteColor.text,
                        }}>
                        {section.title}
                      </Text>
                      <Text
                        style={{
                          ...styles.section_item_detail_text,
                          color: paletteColor.text,
                        }}>
                        {section.detail}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </LayoutApp>
  );
};

export default Info;
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },

  light_wrapper: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  dark_wrapper: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  switch_mode_wrapper: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 999,
    elevation: 999,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  social_wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  social_btn: {
    marginHorizontal: 5,
  },
  sections: {
    width: '100%',
  },
  section_item: {
    marginVertical: 10,
  },
  section_item_title_text: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  section_item_detail_text: {fontSize: 15},
});
