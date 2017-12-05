import React from 'react';
import { View } from 'react-native';

export default class LinearGradientWindows extends React.Component {
  render() {
    let { colors, ...props } = this.props;
    return <View {...props} />;
  }
}
