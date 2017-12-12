import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

const TAG = 'AssistDetailItem';
export default class AssistDetailItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { detail } = this.props;
    return (
      <View style={[styles.container]}>
        <View style={[styles.secondary, { width: 60 }]}>
          <Text style={styles.nrc}>{detail.NRC || detail.NCR}</Text>
        </View>
        <View style={styles.primary}>
          <Text style={styles.text}>{detail.SESION}</Text>
          <Text style={styles.subtitle}>
            {detail.FECHA}
            {' - '}
            {detail.TIPO}
          </Text>
        </View>
        <View style={styles.secondary}>
          <Text
            style={[
              styles.text,
              detail.ASISTENCIA.toLowerCase().indexOf('a') !== -1
                ? { color: '#69d258' }
                : { color: '#be2924' }
            ]}
          >
            {detail.ASISTENCIA.replace(/(<([^>]+)>)/gi, '').trim()}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: '#f4f4f4',
    borderBottomWidth: 1,
    padding: 5,
    flexDirection: 'row'
  },
  primary: {
    flex: 1
  },
  secondary: {
    width: 40,
    alignItems: 'center'
  },
  nrc: {
    fontSize: 12,
    color: '#999',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 12,
    color: '#444',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
    color: '#999'
  }
});
