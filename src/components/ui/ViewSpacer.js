import React from 'react';
import { View } from 'react-native';

export default class ViewSpacer extends React.Component {
  render() {
    let { size, children, ...props } = this.props;
    let spacing = 5;
    switch (size) {
      case 'small':
        spacing = 2;
        break;
      case 'medium':
        spacing = 5;
        break;
      case 'large':
        spacing = 10;
        break;
      default:
        spacing = 5;
        break;
    }
    return (
      <View style={{ margin: spacing }} {...props}>
        {children}
      </View>
    );
  }
}
