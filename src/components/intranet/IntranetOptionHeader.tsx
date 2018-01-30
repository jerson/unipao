import * as React from 'react';
import { NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';

export interface IntranetOptionHeaderProps {}

export interface State {}

const TAG = 'IntranetOptionHeader';
export default class IntranetOptionHeader extends React.Component<
  IntranetOptionHeaderProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  render() {
    return (
      <View style={[styles.container]}>
        <Text style={styles.text}>
          {_(
            'Elige un nivel académico para ver todas las opciones disponibles'
          )}
        </Text>
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
