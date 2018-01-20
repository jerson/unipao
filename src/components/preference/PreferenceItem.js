import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class PreferenceItem extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={[styles.title]}>{this.props.title}</Text>
          {this.props.description && (
            <Text style={styles.description}>{this.props.description}</Text>
          )}
        </View>
        <View style={styles.input}>{this.props.children}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)'
  },
  infoContainer: {
    backgroundColor: 'transparent',
    flex: 1,
    marginRight: 5,
    marginLeft: 5
  },
  input: {
    marginBottom: 0
  },
  title: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#555'
  },

  description: {
    fontSize: 13,
    fontWeight: 'normal',
    color: 'rgba(0,0,0,0.4)'
  }
});
