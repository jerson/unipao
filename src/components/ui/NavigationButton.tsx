import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Touchable, { TouchableProps } from './Touchable';
import Icon, { IconType } from './Icon';
import { Theme } from '../../themes/styles';

export interface NavigationButtonProps extends TouchableProps {
  subMenu?: boolean;
  active?: boolean;
  icon?: string;
  iconType?: IconType;
  style?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
}

export interface State {}

export default class NavigationButton extends React.Component<
  NavigationButtonProps,
  State
> {
  render() {
    const {
      icon,
      iconType,
      subMenu,
      active,
      style,
      onPress,
      ...props
    } = this.props;

    return (
      <Touchable
        style={[styles.button, subMenu && styles.subMenu, style]}
        onPress={onPress}
        {...props}
      >
        <Icon
          style={[
            styles.icon,
            subMenu ? styles.subMenuIcon : undefined,
            subMenu ? Theme.textShadow : undefined,
            active ? styles.subMenuIcon : undefined,
          ]}
          name={icon || ''}
          type={iconType}
        />
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 25,
    color: '#f59331',
  },
  subMenu: {
    position: 'absolute',
    top: 3,
    left: 0,
    margin: 5,
    borderRadius: 4,
    width: 50,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  subMenuIcon: {
    color: '#fff',
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 3,
    width: 40,
    height: 50,
  },
});
