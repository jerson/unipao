import React from 'react';
import { Image, Platform, StyleSheet, Text, View } from 'react-native';
import Touchable from '../ui/Touchable';
import PropTypes from 'prop-types';
import ImageUtil from '../../modules/util/ImageUtil';
import { Theme } from '../../themes/styles';
import LinearGradient from '../ui/LinearGradient';

const TAG = 'GalleryItem';
export default class GalleryItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { gallery, index } = this.props;
    let itemHeight = 200;
    return (
      <View style={[styles.container]}>
        <Touchable
          style={styles.info}
          onPress={() => {
            this.context.navigation.navigate('Gallery', { gallery });
          }}
        >
          <View style={styles.header}>
            <Image
              style={[styles.image, { height: itemHeight }]}
              source={{ uri: ImageUtil.asset(gallery.image) }}
            />
          </View>
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
            style={[
              styles.gradient,
              Platform.OS === 'windows' && {
                backgroundColor: 'rgba(0,0,0,0.3)'
              }
            ]}
          >
            <View style={styles.infoContainer}>
              <Text style={[styles.name, Theme.textShadow]} numberOfLines={2}>
                {gallery.title}
              </Text>
            </View>
          </LinearGradient>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  info: {
    flex: 1,
    flexDirection: 'column'
  },
  name: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 18,
    backgroundColor: 'transparent'
  },
  header: {},
  infoContainer: {
    padding: 5,
    paddingBottom: 10
  },
  image: {
    height: 200
  }
});
