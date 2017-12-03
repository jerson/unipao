import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default class StatusBarView extends React.Component {
  render() {
    if (Platform.OS === 'android') {
      return null;
    }
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.01)',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0
  }
});
