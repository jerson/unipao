import * as React from 'react';
import { StyleProp, View, ViewProperties, ViewStyle } from 'react-native';

export type ViewSpacerSize = 'small' | 'medium' | 'large';

export interface ViewSpacerProps extends ViewProperties {
  style?: StyleProp<ViewStyle>;
  size?: ViewSpacerSize;
  spacing?: number;
}

export interface State {}

export default class ViewSpacer extends React.Component<
  ViewSpacerProps,
  State
> {
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
