import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../themes/styles';
import PropTypes from 'prop-types';
import CacheStorage from '../../modules/storage/CacheStorage';
import Log from '../../modules/logger/Log';
import UPAO from '../../scraping/UPAO';
import Loading from '../../components/ui/Loading';
import NavigationButton from '../../components/ui/NavigationButton';
import DimensionUtil from '../../modules/util/DimensionUtil';
import GalleryImage from '../../components/gallery/GalleryImage';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from '../../components/ui/Modal';

const TAG = 'GalleryScreen';
export default class GalleryScreen extends React.Component {
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
    this.setState({
      showGalleryModal: !this.state.showGalleryModal,
      galleryIndex: index
    });
  };
  hideGallery = () => {
    this.setState({ showGalleryModal: false });
  };

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
    let paddingTop = DimensionUtil.getNavigationBarHeight();
    let images = gallery ? gallery.images || [] : [];
    return (
      <View style={[styles.container, { paddingTop }]}>
        <Modal
          onBackButtonPress={this.hideGallery}
          onBackdropPress={this.hideGallery}
          visible={showGalleryModal}
          style={{ margin: 0 }}
          transparent={true}
        >
          <ImageViewer
            saveToLocalByLongPress={false}
            imageUrls={images.map(image => {
              return { url: image.image };
            })}
            index={galleryIndex}
            renderFooter={currentIndex => {
              let image = images[currentIndex];
              if (!image) {
                return null;
              }
              return (
                <Text style={[styles.imageTitle, Theme.textShadow]}>
                  {image.title}
                </Text>
              );
            }}
          />

          <NavigationButton
            onPress={this.hideGallery}
            subMenu
            icon={'arrow-back'}
          />
        </Modal>

        <FlatList
          style={{ margin: 2 }}
          data={images || []}
          numColumns={2}
          ListHeaderComponent={() => {
            return (
              <View style={styles.header}>
                <Text style={[styles.name, Theme.textShadow]}>
                  {galleryParams.title}
                </Text>
              </View>
            );
          }}
          keyExtractor={(item, index) => index}
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

const stylesSubHTML = StyleSheet.create({
  p: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
    backgroundColor: 'transparent'
  }
});
const stylesHTML = StyleSheet.create({
  p: {
    color: '#343434',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'justify'
  },
  span: {
    margin: 0,
    padding: 0
  },
  div: {
    color: '#343434',
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'justify'
  },
  ul: {
    marginTop: 5,
    marginBottom: 5
  },
  ol: {
    marginTop: 5,
    marginBottom: 5
  },
  strong: {
    color: '#111',
    fontWeight: 'bold'
  }
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  contentContainer: {
    padding: 10,
    paddingTop: 0
  },
  imageTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    backgroundColor: 'transparent',
    margin: 30,
    bottom: 80,
    marginBottom: 50
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
  },
  image: {
    height: 350
  }
});
