import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';
import moment from 'moment';

const TAG = 'ScheduleItem';
export default class ScheduleItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { item } = this.props;

    let type = item.TIPO_CURSO;
    let color = '#69d258';

    if (type === 'P') {
      type = _('Práctica');
      color = '#ff9e30';
    } else if (type === 'L') {
      type = _('Laboratorio');
      color = '#ff465e';
    } else if (type === 'T') {
      type = _('Teoría');
      color = '#2081e5';
    } else if (type === 'A') {
      type = _('Taller');
      color = '#4a4ae5';
    } else if (type === 'I') {
      type = _('Internado');
      color = '#47e0e5';
    } else if (type === 'S') {
      type = _('Seminario');
      color = '#e5ba4b';
    } else if (type === 'AN') {
      type = _('Práctica 1');
      color = '#e57d3f';
    } else if (type === 'AS') {
      type = _('Asesoría');
      color = '#fb6cab';
    } else if (type === 'EM') {
      type = _('Práctica 2');
      color = '#f4bd8b';
    } else if (type === 'FI') {
      type = _('Práctica 3');
      color = '#ffdb39';
    } else if (type === 'HI') {
      type = _('Práctica 4');
      color = '#edee0d';
    } else if (type === 'IN') {
      type = _('Práctica 5');
      color = '#ffdb39';
    } else if (type === 'TP') {
      type = _('Teorico - Práctico');
      color = '#be2924';
    } else {
      type = _('Taller');
    }

    let hours = (item.HORA || '').split(' - ');
    let hourBegin = hours[0]
      ? moment(hours[0].trim(), 'HHmm').format('hh:mm a')
      : '';
    let hourEnd = hours[1]
      ? moment(hours[1].trim(), 'HHmm').format('hh:mm a')
      : '';

    return (
      <View style={[styles.container]}>
        <View style={[styles.header]}>
          <View style={styles.primary}>
            <Text style={styles.title}>
              {hourBegin}
              {hourEnd ? ' - ' + hourEnd : ''}
            </Text>
          </View>
          <View style={styles.secondary}>
            <Text style={styles.title}>{item.AULA}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={[styles.typeContainer, { backgroundColor: color }]}>
            <Text style={styles.typeKey}>{item.TIPO_CURSO}</Text>
          </View>
          <View style={styles.detail}>
            <Text style={styles.course}>{item.NOMBRE_CURSO}</Text>
            <Text style={styles.type}>{type}</Text>
            <Text style={styles.subtitle}>
              {item.CURSO} - {_('NRC')}: {item.NRC}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    flexDirection: 'column'
  },
  course: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555'
  },
  type: {
    fontSize: 13,
    color: '#999'
  },
  subtitle: {
    fontSize: 12,
    color: '#999'
  },
  info: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center'
  },
  detail: {
    flex: 1,
    paddingLeft: 5
  },
  typeKey: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  typeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    borderRadius: 50 / 2,
    height: 50,
    width: 50
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#0d61ac',
    padding: 5
  },
  title: {
    color: 'rgba(255,255,255,0.8)'
  },
  primary: {
    flex: 1
  },
  secondary: {
    alignItems: 'center'
  }
});
