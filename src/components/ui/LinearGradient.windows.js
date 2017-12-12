import React from 'react';
import { StyleSheet, View } from 'react-native';

export default class LinearGradientWindows extends React.Component {
  render() {
    let { colors, style, ...props } = this.props;
    return (
      <View style={[styles.absolute, styles.backdrop, style]} {...props} />
    );
  }
}
const styles = StyleSheet.create({
  container: {},
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  absolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
});
