import * as React from 'react';
import { Platform, StatusBarProperties, StyleSheet } from 'react-native';

export interface StatusBarViewProps extends StatusBarProperties {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content';
}

export interface State {}

export default class StatusBarView extends React.Component<
  StatusBarViewProps,
  State
> {
  render() {
    if (Platform.OS !== 'ios') {
      return null;
    }
    return null;
    // let { style, ...props } = this.props;
    // return <View style={[styles.container, style]} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.01)',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0
  }
});
