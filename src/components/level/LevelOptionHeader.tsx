import * as React from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import * as PropTypes from 'prop-types';
import Log from '../../modules/logger/Log';
import Request from '../../modules/network/Request';
import Icon from '../ui/Icon';
import Loading from '../ui/Loading';
import { _ } from '../../modules/i18n/Translator';
import Touchable from '../ui/Touchable';
import CacheStorage from '../../modules/storage/CacheStorage';

export interface LevelOptionHeaderProps {}

export interface State {}

const TAG = 'LevelOptionHeader';
export default class LevelOptionHeader extends React.Component<
  LevelOptionHeaderProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  render() {
    return (
      <View style={[styles.container]}>
        <Text style={styles.text}>{_('Elige una opción')}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent: 'center'
  },
  text: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center'
  }
});
