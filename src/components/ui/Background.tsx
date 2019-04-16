import * as React from 'react';
import { StyleSheet, View } from 'react-native';

export interface BackgroundProps {}

export interface State {
  isVisible: boolean;
}

export default class Background extends React.Component<
  BackgroundProps,
  State
> {
  render() {
    return <View style={[styles.absolute, styles.container]} />;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d61ac',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
