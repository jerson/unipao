import * as React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScaledSize,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import * as PropTypes from 'prop-types';
import { Theme } from '../../themes/styles';
import NavigationButton from '../ui/NavigationButton';
import Modal from '../ui/Modal';
import LinearGradient from '../ui/LinearGradient';
import ImageZoom from 'react-native-image-pan-zoom';
import { GalleryImageModel } from '../../scraping/info/Gallery';

export interface GalleryModalProps {
  images: GalleryImageModel[];
  index: number;
  isVisible: boolean;
  onModalShow?: () => void;
  onModalHide?: () => void;
  onBackButtonPress?: () => void;
  onBackdropPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export interface State {
  currentIndex: number;
  width: number;
  height: number;
}

export interface DimensionsChange {
  window: ScaledSize;
  screen?: ScaledSize;
}

const TAG = 'GalleryModal';
export default class GalleryModal extends React.PureComponent<
  GalleryModalProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  state = {
    currentIndex: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };

  refs: any;
  renderItem = ({ item, index }: ListRenderItemInfo<GalleryImageModel>) => {
    const { width, height } = this.state;

    return (
      <View style={{ width, flex: 1 }}>
        <ImageZoom
          cropWidth={width}
          cropHeight={height}
          imageWidth={width}
          imageHeight={height}
        >
          <Image
            style={{ width, height }}
            resizeMode={'contain'}
            source={{ uri: item.image }}
          />
        </ImageZoom>
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          style={[
            styles.background,
            Platform.OS === 'windows' && {
              backgroundColor: 'rgba(0,0,0,0.3)',
            },
          ]}
        >
          <View style={styles.content}>
            <Text style={[styles.imageTitle, Theme.textShadow]}>
              {item.title}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  prev = () => {
    const { width, currentIndex } = this.state;
    let page = currentIndex;
    page--;
    page = page < 0 ? 0 : page;
    this.refs.list &&
      this.refs.list.scrollToOffset({
        offset: page * width,
      });
  };

  next = () => {
    const { images } = this.props;
    const { width, currentIndex } = this.state;
    let page = currentIndex;
    page++;
    page = page >= images.length ? 0 : page;
    this.refs.list &&
      this.refs.list.scrollToOffset({
        offset: page * width,
      });
  };
  onScroll = (e?: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!e) {
      return;
    }
    const { currentIndex, width } = this.state;
    const contentOffset = e.nativeEvent!.contentOffset;
    const newIndex = Math.round(contentOffset.x / width);

    if (currentIndex === newIndex) {
      return;
    }

    this.setState({ currentIndex: newIndex });
  };
  onDimensionsChange = ({ window, screen }: DimensionsChange) => {
    const { width, height } = window;

    this.setState(
      {
        width,
        height,
      },
      () => {
        const { currentIndex } = this.state;
        this.refs.list &&
          this.refs.list.scrollToOffset({
            offset: currentIndex * width,
            animated: false,
          });
      }
    );
  };

  componentDidMount() {
    setTimeout(() => {
      const { index } = this.props;
      this.setState({ currentIndex: index }, () => {
        Dimensions.addEventListener('change', this.onDimensionsChange);
        this.onDimensionsChange({ window: Dimensions.get('window') });
      });
    }, 1);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  render() {
    const { images, onBackButtonPress, ...props } = this.props;
    const { width, height } = this.state;

    return (
      <Modal
        onBackButtonPress={onBackButtonPress}
        style={[styles.modal]}
        {...props}
      >
        <StatusBar
          backgroundColor="#222"
          translucent
          animated
          barStyle="light-content"
        />
        <FlatList
          ref={'list'}
          data={images}
          extraData={{ width, height }}
          style={styles.list}
          horizontal
          pagingEnabled
          onScroll={this.onScroll}
          scrollEventThrottle={800}
          showsHorizontalScrollIndicator={true}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
        />

        <NavigationButton
          onPress={onBackButtonPress}
          subMenu
          style={{ top: Platform.OS === 'ios' ? 20 : 5 }}
          icon={'arrow-back'}
        />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  modal: { margin: 0, flex: 1, backgroundColor: '#222' },
  content: {
    padding: 20,
  },
  background: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
});
