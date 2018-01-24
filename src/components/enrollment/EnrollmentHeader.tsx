import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import AlertMessage from '../ui/AlertMessage';
import { _ } from '../../modules/i18n/Translator';

export interface EnrollmentHeaderProps {
  enrollments: any[];
  title: string;
}

export interface State {
  first?: any;
}

const TAG = 'EnrollmentHeader';
export default class EnrollmentHeader extends React.Component<
  EnrollmentHeaderProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state: State = {};

  componentDidMount() {
    let { enrollments, title } = this.props;
    let first = enrollments[0] || {};

    this.setState({
      first
    });
  }

  render() {
    let { enrollments } = this.props;
    let { first } = this.state;

    if (!first) {
      return null;
    }

    if (!enrollments || enrollments.length < 1) {
      return (
        <AlertMessage type={'warning'} title={_('No se encontraron datos')} />
      );
    }

    return (
      <View style={[styles.container]}>
        <View style={[styles.career]}>
          <Text style={styles.name}>{first.NOMBRE_CURSO}</Text>
          <Text style={styles.code}>{first.CURSO}</Text>
        </View>
        <View style={[styles.legend]}>
          <Text style={styles.legendText}>
            {_('CICLO: {cicle}', { cicle: first.CICLO })}
          </Text>
          <Text style={styles.legendText}>
            {_('VEZ: {times}', { times: first.VEZ })}
          </Text>
        </View>
        <View style={[styles.header]}>
          <View style={styles.headerItem}>
            <Text style={styles.title}>{_('NRC')}</Text>
          </View>
          <View style={styles.headerItem}>
            <Text style={styles.title}>{_('CRE')}</Text>
          </View>
          <View style={styles.headerItem}>
            <Text style={styles.title}>{_('TPLA')}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#999',
    fontSize: 10,
    fontWeight: 'bold'
  },
  headerItem: {
    flex: 1,
    alignItems: 'center'
  },
  legendText: {
    flex: 1,
    color: '#999',
    textAlign: 'center',
    fontSize: 11
  },
  container: {
    backgroundColor: '#fff'
  },
  header: {
    justifyContent: 'space-between',
    paddingTop: 3,
    flexDirection: 'row'
  },
  name: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  },
  code: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12
  },
  career: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#0d61ac'
  },
  legend: {
    padding: 3,
    flexDirection: 'row',
    borderColor: '#f4f4f4',
    borderBottomWidth: 1
  }
});
