import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

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
            <Text style={styles.title}>{title}</Text>
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
  }
});
