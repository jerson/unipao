import * as React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export type LoadingSize = 'small' | 'large' | number;

export interface LoadingProps {
  style?: StyleProp<ViewStyle>;
  margin?: boolean;
  color?: string;
  size?: LoadingSize;
}

export interface State {}

export default class Loading extends React.Component<LoadingProps, State> {
  render() {
    let { style, color, margin, ...props } = this.props;
    color = color || '#f59331';

    return (
      <View style={[style, margin && styles.margin]} {...props}>
        <ActivityIndicator color={color} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  margin: {
    margin: 20,
    alignSelf: 'center',
  },
});
