import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';

const TAG = 'EnrollmentInfoHeader';
export default class EnrollmentInfoHeader extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  render() {
    let { first } = this.props;

    if (!first) {
      return null;
    }

    return (
      <View style={[styles.container]}>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Periodo')}:</Text>
          <Text style={styles.value}> {first.PERIODO}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Facultad')}:</Text>
          <Text style={styles.value}> {first.FACULTAD}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.description}>{_('Carrera')}:</Text>
          <Text style={styles.value}> {first.CARRERA}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10
  },

  item: {
    padding: 2,
    flexDirection: 'row'
  },
  description: {
    color: 'rgba(0,0,0,0.6)',
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    paddingRight: 5
  },
  value: {
    color: '#000',
    flex: 2,
    fontSize: 12,
    fontWeight: 'bold'
  }
});
