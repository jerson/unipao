import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../themes/styles';

export default class PreferenceHeader extends React.Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <Text style={[styles.title, Theme.textShadow]}>{this.props.title}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 12,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  title: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)'
  }
});
