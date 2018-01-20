import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import LinearGradient from './LinearGradient';

export default class Background extends React.Component {
  render() {
    return (
      <View style={[styles.absolute, styles.container]}>
        {/*{Platform.OS !== 'windows' && (*/}
        {/*<LinearGradient*/}
        {/*colors={['#2281c3', '#0e6dc2', '#0d61ac']}*/}
        {/*style={styles.background}*/}
        {/*/>*/}
        {/*)}*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d61ac'
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
