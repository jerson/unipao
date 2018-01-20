import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../../themes/styles';
import PropTypes from 'prop-types';
import NavigationButton from '../../../components/ui/NavigationButton';
import ImageZoom from 'react-native-image-pan-zoom';
import LinearGradient from '../../../components/ui/LinearGradient';

const TAG = 'GalleryPhotoScreen';
export default class GalleryPhotoScreen extends React.PureComponent {
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 180
  };
  onDimensionsChange = ({ window, screen }) => {
    let { width, height } = window;

    this.setState({ width, height: height - 180 });
  };

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
  }

  componentDidMount() {
    Dimensions.addEventListener('change', this.onDimensionsChange);
    this.onDimensionsChange({ window: Dimensions.get('window') });
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.onDimensionsChange);
  }

  render() {
    let { image } = this.getParams();
    let { width, height } = this.state;

    return (
      <View style={[styles.container]}>
        <ImageZoom
          cropWidth={width}
          cropHeight={height}
          imageWidth={width}
          imageHeight={height}
        >
          <Image
            style={{ width, height }}
            resizeMode={'contain'}
            source={{ uri: image.image }}
          />
        </ImageZoom>

        <NavigationButton
          onPress={() => {
            this.props.navigation.goBack();
          }}
          subMenu
          icon={'arrow-back'}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
          style={styles.background}
        >
          <View style={styles.content}>
            <Text style={[styles.imageTitle, Theme.textShadow]}>
              {image.title}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1
  },
  container: {
    backgroundColor: '#222',
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