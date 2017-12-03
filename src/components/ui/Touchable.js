import React from 'react';
import { TouchableOpacity } from 'react-native';

export default class Touchable extends React.Component {
  render() {
    let { ...props } = this.props;
    return <TouchableOpacity {...props} />;
  }
}
