import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from './LinearGradient';

export default class Background extends React.Component {
  render() {
    return (
      <View style={[styles.absolute, styles.container]}>
        <LinearGradient
          colors={['#2281c3', '#0e6dc2', '#0d61ac']}
          style={styles.background}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d61ac'
  },
  background: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
    // opacity:0.5
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});
