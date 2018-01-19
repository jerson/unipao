import React from 'react';
import { StyleSheet } from 'react-native';
import Touchable from './Touchable';
import Icon from './Icon';
import { Theme } from '../../themes/styles';

export default class NavigationButton extends React.Component {
  render() {
    let { icon, iconType, subMenu,active, style, onPress, ...props } = this.props;

    return (
      <Touchable
        style={[styles.button, subMenu && styles.subMenu, style]}
        onPress={onPress}
        {...props}
      >
        <Icon
          style={[
            styles.icon,
            subMenu && styles.subMenuIcon,
            subMenu && Theme.textShadow,
              active && styles.subMenuIcon,
          ]}
          name={icon}
          type={iconType}
        />
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 25,
    color: '#f59331'
  },
  subMenu: {
    position: 'absolute',
    top: 60,
    left: 0,
    margin: 5,
    borderRadius: 4,
    width: 50,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  subMenuIcon: {
    color: '#fff'
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 3,
    width: 40,
    height: 50
  }
});
