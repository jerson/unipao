import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';

const TAG = 'PeriodHeader';
export default class PeriodHeader extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { title, courses } = this.props;
    return (
      <View style={[styles.container]}>
        <View style={[styles.header]}>
          <View style={styles.primary}>
            <Text style={styles.title}>
              {_('Periodo')}
              {': '}
            </Text>
            <Text style={styles.subtitle}>{title}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#0d61ac',
    padding: 12
  },
  title: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '400',
    fontSize: 14
  },
  subtitle: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 14
  },
  primary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
