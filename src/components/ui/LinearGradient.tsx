import * as React from 'react';
import LinearGradientBase from 'react-native-linear-gradient';
import { StyleProp, ViewStyle } from 'react-native';

export interface LinearGradientProps {
  style?: StyleProp<ViewStyle>;
  colors: string[];
}

export interface State {}

export default class LinearGradient extends React.Component<
  LinearGradientProps,
  State
> {
  render() {
    const { ...props } = this.props;
    return <LinearGradientBase {...props} />;
  }
}
