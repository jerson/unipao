import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Touchable from '../ui/Touchable';
import PropTypes from 'prop-types';
import ImageUtil from '../../modules/util/ImageUtil';
import { Theme } from '../../themes/styles';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { _ } from '../../modules/i18n/Translator';

const TAG = 'NewsItem';
export default class NewsItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { height } = Dimensions.get('screen');
    let { news, index } = this.props;
    let ago = moment(news.FECHANOTICIA || '').fromNow();
    let itemHeight = height / 3;
    return (
      <View style={[styles.container]}>
        <Touchable
          style={styles.info}
          onPress={() => {
            this.context.navigation.navigate('News', { news });
          }}
        >
          <View style={styles.header}>
            <Image
              style={[styles.image, { height: itemHeight }]}
              source={{ uri: ImageUtil.asset(news.URL1) }}
            />
          </View>
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)']}
            style={styles.gradient}
          />
          <View style={styles.infoContainer}>
            <Text style={[styles.name, Theme.textShadow]}>
              {news.TITULO.trim()}
            </Text>
            <Text style={[styles.ago, Theme.textShadow]}>
              {_('Publicado')} {ago}
            </Text>
          </View>
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
    bottom: 0,
    height: 130
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
  ago: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    backgroundColor: 'transparent'
  },
  header: {},
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 5,
    paddingBottom: 10
  },
  image: {
    height: 200
  }
});
