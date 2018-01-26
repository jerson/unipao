import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import ImageUtil from '../../modules/util/ImageUtil';
import Touchable from '../ui/Touchable';

export interface GalleryImageProps {
  image: any;
  onShowGallery: () => void;
}

export interface State {}

const TAG = 'GalleryImage';
export default class GalleryImage extends React.Component<
  GalleryImageProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state: State = {};

  toggle = () => {
    let { onShowGallery } = this.props;
    if (typeof onShowGallery === 'function') {
      onShowGallery();
    }
  };

  render() {
    let { image, onShowGallery } = this.props;
    return (
      <View style={styles.container}>
        <Touchable onPress={this.toggle}>
          <Image
            resizeMode={'cover'}
            style={[styles.image, { height: 120 }]}
            source={{ uri: ImageUtil.asset(image.image) }}
          />
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  image: {
    height: 200
  }
});
