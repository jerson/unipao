import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import ImageUtil from '../../modules/util/ImageUtil';
import Touchable from '../ui/Touchable';

const TAG = 'GalleryImage';
export default class GalleryImage extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

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
            source={{ uri: ImageUtil.asset(image.imageSmall) }}
          />
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 2,

    flex: 1
  },
  image: {
    height: 200
  }
});
