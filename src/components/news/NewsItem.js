import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Touchable from '../ui/Touchable';
import PropTypes from 'prop-types';
import ImageUtil from '../../modules/util/ImageUtil';
import { Theme } from '../../themes/styles';
import moment from 'moment';
import { _ } from '../../modules/i18n/Translator';
import LinearGradient from '../ui/LinearGradient';

const TAG = 'NewsItem';
export default class NewsItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { height } = Dimensions.get('window');
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
            style={[
              styles.gradient,
              Platform.OS === 'windows' && {
                backgroundColor: 'rgba(0,0,0,0.8)'
              },
              Platform.OS !== 'windows' ? { minHeight: 130 } : { minHeight: 90 }
            ]}
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
