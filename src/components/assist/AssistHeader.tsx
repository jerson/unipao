import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import AssistItem from './AssistItem';
import { _ } from '../../modules/i18n/Translator';

const TAG = 'AssistHeader';
export default class AssistHeader extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let { assist } = this.props;
    return (
      <View style={[styles.container]}>
        <AssistItem disabledPress assist={assist} />
        <View style={[styles.header]}>
          <View style={[styles.secondary, { width: 60 }]}>
            <Text style={styles.title}>{_('NRC')}</Text>
          </View>
          <View style={styles.primary}>
            <Text style={styles.title}>{_('SESIÓN')}</Text>
          </View>
          <View style={styles.secondary}>
            <Text style={styles.title}>{_('IND')}</Text>
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
    padding: 5
  },
  title: {
    color: 'rgba(255,255,255,0.8)'
  },
  primary: {
    flex: 1,
    alignItems: 'center'
  },
  secondary: {
    width: 40,
    alignItems: 'center'
  }
});
