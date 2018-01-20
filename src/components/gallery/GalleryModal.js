import React from 'react';
import {
  Platform,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
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
export default class GalleryModal extends React.PureComponent {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {
    currentIndex: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  };

  renderItem = ({ item, index }) => {
    let { width, height } = this.state;

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
    let { currentIndex, width } = this.state;
    let contentOffset = e.nativeEvent.contentOffset;
    let newIndex = Math.round(contentOffset.x / width);

    if (currentIndex === newIndex) {
      return;
    }

    this.setState({ currentIndex: newIndex });
  };
  onDimensionsChange = ({ window, screen }) => {
    let { width, height } = window;

    this.setState(
      {
        width,
        height
      },
      () => {
        let { currentIndex } = this.state;
        this.refs.list &&
          this.refs.list.scrollToOffset({
            offset: currentIndex * width,
            animated: false
          });
      }
    );
  };

  componentDidMount() {
    setTimeout(() => {
      let { index } = this.props;
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
    let { images, onBackButtonPress, ...props } = this.props;
    let { width, height } = this.state;

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
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => {
            return index;
          }}
        />

        <NavigationButton
          onPress={onBackButtonPress}
          subMenu
          style={{ paddingTop: Platform.OS === 'ios' ? 30 : 0 }}
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
    padding: 20
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
