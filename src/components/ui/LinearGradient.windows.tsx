import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export interface LinearGradientProps {
  style?: StyleProp<ViewStyle>;
  colors: string[];
}

export interface State {}

export default class LinearGradientWindows extends React.Component<
  LinearGradientProps,
  State
> {
  render() {
    let { colors, style, ...props } = this.props;
    return (
      <View style={[styles.absolute, styles.backdrop, style]} {...props} />
    );
  }
}
const styles = StyleSheet.create({
  backdrop: {},
  absolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
});
