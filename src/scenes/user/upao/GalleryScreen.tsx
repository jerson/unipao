import * as React from 'react';
import {
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Color, Theme } from '../../../themes/styles';
import * as PropTypes from 'prop-types';
import CacheStorage from '../../../modules/storage/CacheStorage';
import Log from '../../../modules/logger/Log';
import UPAO from '../../../scraping/UPAO';
import Loading from '../../../components/ui/Loading';
import NavigationButton from '../../../components/ui/NavigationButton';
import GalleryImage from '../../../components/gallery/GalleryImage';
import FlexibleGrid from '../../../components/ui/FlexibleGrid';
import GalleryModal from '../../../components/gallery/GalleryModal';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';
import {
  GalleryDetailModel,
  GalleryModel,
} from '../../../scraping/info/Gallery';

export interface GalleryScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface State {
  cacheLoaded: boolean;
  showGalleryModal: boolean;
  gallery?: GalleryDetailModel;
  galleryIndex: number;
  isLoading: boolean;
}

const TAG = 'GalleryScreen';
export default class GalleryScreen extends React.PureComponent<
  GalleryScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: '',
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
    ],
  };
  state: State = {
    cacheLoaded: false,
    showGalleryModal: false,
    gallery: undefined,
    galleryIndex: 0,
    isLoading: true,
  };
  load = async () => {
    this.setState({ isLoading: true, cacheLoaded: false });
    await this.checkCache();
    await this.loadRequest();
  };
  getCacheKey = () => {
    const { gallery } = this.getParams();
    return `gallery_${gallery.id}`;
  };
  checkCache = async () => {
    try {
      const data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (gallery?: GalleryDetailModel, cacheLoaded = false) => {
    this.setState({
      cacheLoaded,
      gallery,
      isLoading: false,
    });
  };
  loadRequest = async () => {
    const { gallery } = this.getParams();
    const { cacheLoaded } = this.state;

    try {
      const item = await UPAO.Info.Gallery.get(gallery.id);
      this.loadResponse(item);
      CacheStorage.set(this.getCacheKey(), item);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse(undefined);
      } else {
        this.setState({
          isLoading: false,
        });
      }
    }
  };
  toogleGallery = (index: number) => {
    const { gallery } = this.state;
    const images = gallery ? gallery.images || [] : [];

    if (Platform.OS === 'windows') {
      const image = images[index];
      image && this.props.navigation.navigate('Photo', { image });
    } else {
      this.setState({
        showGalleryModal: !this.state.showGalleryModal,
        galleryIndex: index,
      });
    }
  };
  hideGallery = () => {
    this.setState({ showGalleryModal: false });
  };

  componentWillUnmount() {
    UPAO.abort('Gallery.get');
  }

  getParams(): any {
    const { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentDidMount() {
    this.load();
  }

  render() {
    const { gallery: galleryParams } = this.getParams();
    const { gallery, isLoading, galleryIndex, showGalleryModal } = this.state;
    const images = gallery ? gallery.images || [] : [];

    return (
      <View style={[styles.container]}>
        {showGalleryModal && (
          <GalleryModal
            images={images}
            index={galleryIndex}
            onBackButtonPress={this.hideGallery}
            onBackdropPress={this.hideGallery}
            isVisible
          />
        )}
        <FlexibleGrid
          itemWidth={150}
          itemMargin={2}
          data={images}
          showsVerticalScrollIndicator={true}
          ListHeaderComponent={() => {
            return (
              <View style={styles.header}>
                <Text numberOfLines={2} style={[styles.name, Theme.textShadow]}>
                  {galleryParams.title}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }: ListRenderItemInfo<GalleryModel>) => (
            <GalleryImage
              image={item}
              onShowGallery={() => {
                this.toogleGallery(index);
              }}
            />
          )}
        />
        {isLoading && <Loading margin />}

        {!showGalleryModal && (
          <NavigationButton
            onPress={() => {
              this.props.navigation.goBack();
            }}
            subMenu
            icon={'arrow-back'}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  name: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  header: {
    justifyContent: 'center',
    padding: 4,
    paddingTop: 0,
    height: 60,
    paddingLeft: 60,
  },
});
