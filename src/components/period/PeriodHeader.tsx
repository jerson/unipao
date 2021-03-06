import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import { _ } from '../../modules/i18n/Translator';

export interface PeriodHeaderProps {
  title: string;
}

export interface State {}

const TAG = 'PeriodHeader';
export default class PeriodHeader extends React.Component<
  PeriodHeaderProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state: State = {};

  render() {
    let { title } = this.props;
    let part1 = title.slice(0, 4);
    let part2 = title.slice(4, 7);
    return (
      <View style={[styles.container]}>
        <View style={[styles.header]}>
          <View style={styles.primary}>
            <Text style={styles.title}>
              {_('Periodo')}
              {': '}
            </Text>
            <Text style={styles.subtitle}>
              {part1}
              {' - '}
              {part2}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderColor: '#f4f4f4',
    borderBottomWidth: 1
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    padding: 12
  },
  title: {
    color: '#999',
    fontWeight: '400',
    fontSize: 14
  },
  subtitle: {
    color: '#f59331',
    fontWeight: 'bold',
    fontSize: 14
  },
  primary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
