import React from 'react';
import { Switch as SwitchBase } from 'react-native';

export default class Switch extends React.Component {
  render() {
    let { activeColor, ...props } = this.props;

    activeColor = activeColor || '#d4d4d4';
    return (
      <SwitchBase
        thumbTintColor={'#fff'}
        onTintColor={'#f59331'}
        tintColor={'rgba(0,0,0,0.1)'}
        {...props}
      />
    );
  }
}
