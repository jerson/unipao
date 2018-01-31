import * as React from 'react';
import { NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';

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
