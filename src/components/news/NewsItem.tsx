import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Touchable from '../ui/Touchable';
import * as PropTypes from 'prop-types';
import ImageUtil from '../../modules/util/ImageUtil';
import { Theme } from '../../themes/styles';
import { _ } from '../../modules/i18n/Translator';

const moment = require('moment');

const TAG = 'NewsItem';
export default class NewsItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { news, index } = this.props;
    let ago = moment(news.date || '').fromNow();
    let itemHeight = 200;
    return (
      <View style={[styles.container]}>
        <Touchable
          style={[styles.info, Theme.shadowLarge]}
          onPress={() => {
            this.context.navigation.navigate('News', { news });
          }}
        >
          <View style={styles.header}>
            <Image
              style={[styles.image, { height: itemHeight }]}
              source={{ uri: ImageUtil.asset(news.image) }}
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={[styles.name]} numberOfLines={2}>
              {news.title}
            </Text>
            <Text style={[styles.ago]}>
              {_('Publicado')} {ago}
            </Text>
          </View>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  info: {
    borderRadius: 2,
    flex: 1,
    flexDirection: 'column'
  },
  name: {
    color: '#666',
    fontSize: 15,
    backgroundColor: 'transparent'
  },
  ago: {
    color: '#999',
    marginTop: 2,
    fontSize: 12,
    backgroundColor: 'transparent'
  },
  header: {},
  infoContainer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    padding: 5,
    paddingLeft: 8,
    paddingBottom: 8
  },
  image: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    height: 200
  }
});
