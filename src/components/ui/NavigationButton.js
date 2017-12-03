import React from 'react';
import { StyleSheet } from 'react-native';
import Touchable from './Touchable';
import Icon from './Icon';

export default class NavigationButton extends React.Component {
  render() {
    let { icon, iconType, style, onPress, ...props } = this.props;

    return (
      <Touchable style={[styles.button, style]} onPress={onPress} {...props}>
        <Icon style={[styles.icon]} name={icon} type={iconType} />
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 25,
    color: '#f59331'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 3,
    width: 40,
    height: 50
  }
});
