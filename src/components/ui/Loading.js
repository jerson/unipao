import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default class Loading extends React.Component {
  render() {
    let { style, color, margin, ...props } = this.props;
    color = color || '#f59331';

    return (
      <View style={[style, margin && styles.margin]}>
        <ActivityIndicator color={color} {...props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  margin: {
    margin: 20,
    alignSelf: 'center'
  }
});
