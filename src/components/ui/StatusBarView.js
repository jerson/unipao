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
    backgroundColor: '#0d61ac',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0
  }
});
