import React from 'react';
import LinearGradientBase from 'react-native-linear-gradient';

export default class LinearGradient extends React.Component {
  render() {
    let { ...props } = this.props;
    return <LinearGradientBase {...props} />;
  }
}
