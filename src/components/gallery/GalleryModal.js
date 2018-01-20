import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import PropTypes from 'prop-types';
import { Theme } from '../../themes/styles';
import NavigationButton from '../ui/NavigationButton';
import Modal from '../ui/Modal';
import LinearGradient from '../ui/LinearGradient';
import ImageZoom from 'react-native-image-pan-zoom';

const TAG = 'GalleryModal';
export default class GalleryModal extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {
    currentIndex: 0,
    firstLoad: true,
    width: Dimensions.get('screen').width
  };

  renderItem = ({ item, index }) => {
    let { width, height } = this.state;

    return (
      <View style={{ width, height, flex: 1 }}>
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
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
          style={styles.background}
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
    let { width, currentIndex } = this.state;
    let page = currentIndex;
    page--;
    page = page < 0 ? 0 : page;
    this.refs.list &&
      this.refs.list.scrollToOffset({
        offset: page * width
      });
  };

  next = () => {
    let { images } = this.props;
    let { width, currentIndex } = this.state;
    let page = currentIndex;
    page++;
    page = page >= images.length ? 0 : page;
    this.refs.list &&
      this.refs.list.scrollToOffset({
        offset: page * width
      });
  };
  onScroll = e => {
    let { currentIndex, firstLoad } = this.state;
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    let newIndex = Math.round(contentOffset.x / viewSize.width);
    let { width, height } = viewSize;

    if (contentOffset.x === 1) {
      this.setState({ width });
    }

    if (currentIndex === newIndex) {
      return;
    }

    this.setState(
      { currentIndex: newIndex, width, height, firstLoad: false },
      () => {
        if (firstLoad) {
          this.refs.list &&
            this.refs.list.scrollToOffset({
              offset: currentIndex * width,
              animated: true
            });
        }
      }
    );
  };

  componentDidMount() {
    let { index } = this.props;

    this.setState({ currentIndex: index }, () => {
      setTimeout(() => {
        this.refs.list &&
          this.refs.list.scrollToOffset({
            offset: 1
          });
      }, 100);
    });
  }

  render() {
    let { images, onBackButtonPress, ...props } = this.props;

    return (
      <Modal
        onBackButtonPress={onBackButtonPress}
        style={[styles.modal]}
        {...props}
      >
        <FlatList
          ref={'list'}
          data={images}
          style={styles.list}
          horizontal
          pagingEnabled
          onScroll={this.onScroll}
          scrollEventThrottle={800}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => {
            return index;
          }}
        />

        <NavigationButton
          onPress={onBackButtonPress}
          subMenu
          icon={'arrow-back'}
        />
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  modal: { margin: 0, flex: 1, backgroundColor: '#222' },
  content: {
    padding: 30
  },
  background: {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  imageTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    backgroundColor: 'transparent'
  }
});
