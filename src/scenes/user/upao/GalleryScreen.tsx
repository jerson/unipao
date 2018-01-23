import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../../themes/styles';
import * as PropTypes from 'prop-types';
import CacheStorage from '../../../modules/storage/CacheStorage';
import Log from '../../../modules/logger/Log';
import UPAO from '../../../scraping/UPAO';
import Loading from '../../../components/ui/Loading';
import NavigationButton from '../../../components/ui/NavigationButton';
import GalleryImage from '../../../components/gallery/GalleryImage';
import FlexibleGrid from '../../../components/ui/FlexibleGrid';
import GalleryModal from '../../../components/gallery/GalleryModal';

const TAG = 'GalleryScreen';
export default class GalleryScreen extends React.PureComponent {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: '',
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ]
  });
  state = {
    showGalleryModal: false,
    gallery: null,
    galleryIndex: 0,
    isLoading: true
  };
  load = async () => {
    this.setState({ isLoading: true, cacheLoaded: false });
    await this.checkCache();
    await this.loadRequest();
  };
  getCacheKey = () => {
    let { gallery } = this.getParams();
    return `gallery_${gallery.id}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (gallery, cacheLoaded = false) => {
    this.setState({
      cacheLoaded,
      gallery,
      isLoading: false
    });
  };
  loadRequest = async () => {
    let { gallery } = this.getParams();
    let { cacheLoaded } = this.state;

    try {
      let item = await UPAO.Info.Gallery.get(gallery.id);
      this.loadResponse(item);
      CacheStorage.set(this.getCacheKey(), item);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse(null);
      } else {
        this.setState({
          isLoading: false
        });
      }
    }
  };
  toogleGallery = index => {
    let { gallery } = this.state;
    let images = gallery ? gallery.images || [] : [];

    if (Platform.OS === 'windows') {
      let image = images[index];
      image && this.props.navigation.navigate('Photo', { image });
    } else {
      this.setState({
        showGalleryModal: !this.state.showGalleryModal,
        galleryIndex: index
      });
    }
  };
  hideGallery = () => {
    this.setState({ showGalleryModal: false });
  };

  componentWillUnmount() {
    UPAO.abort('Gallery.get');
  }

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
  }

  componentDidMount() {
    this.load();
  }

  render() {
    let { gallery: galleryParams } = this.getParams();
    let { gallery, isLoading, galleryIndex, showGalleryModal } = this.state;
    let images = gallery ? gallery.images || [] : [];

    return (
      <View style={[styles.container]}>
        {showGalleryModal && (
          <GalleryModal
            images={images}
            index={galleryIndex}
            onBackButtonPress={this.hideGallery}
            onBackdropPress={this.hideGallery}
            visible
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
          renderItem={({ item, index }) => (
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
    backgroundColor: '#222'
  },
  name: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 18,
    backgroundColor: 'transparent'
  },
  header: {
    justifyContent: 'center',
    padding: 4,
    paddingTop: 0,
    height: 60,
    paddingLeft: 60
  }
});
