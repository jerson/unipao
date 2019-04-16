import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Theme } from '../../themes/styles';
import Touchable, { TouchableProps } from './Touchable';
import Icon, { IconType } from './Icon';
import Loading from './Loading';

export type ButtonType =
  | 'default'
  | 'primary'
  | 'danger'
  | 'warning'
  | 'info'
  | 'success'
  | 'alter'
  | 'facebook'
  | 'link';
export type ButtonSize = 'default' | 'small' | 'medium' | 'large';
export type IconPosition = 'before' | 'after';

export interface ButtonProps extends TouchableProps {
  label?: string;
  isLoading?: boolean;
  icon?: string;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconPosition?: IconPosition;
  iconType?: IconType;
  type?: ButtonType;
  size?: ButtonSize;
  onPress?: (event: GestureResponderEvent) => void;
}

export interface State {}

export default class Button extends React.Component<ButtonProps, State> {
  render() {
    const {
      label,
      icon,
      isLoading,
      iconType,
      type,
      size,
      style,
      ...props
    } = this.props;
    let containerStyle = null;
    let textStyle = null;
    let loadingColor = null;
    switch (type) {
      case 'facebook':
        containerStyle = styles.facebook;
        textStyle = styles.facebookText;
        loadingColor = '#fff';
        break;
      case 'primary':
        containerStyle = styles.primary;
        textStyle = styles.primaryText;
        loadingColor = '#fff';
        break;
      case 'danger':
        containerStyle = styles.danger;
        textStyle = styles.dangerText;
        loadingColor = '#fff';
        break;
      case 'warning':
        containerStyle = styles.warning;
        textStyle = styles.warningText;
        loadingColor = '#fff';
        break;
      case 'success':
        containerStyle = styles.success;
        textStyle = styles.successText;
        loadingColor = '#fff';
        break;
      case 'alter':
        containerStyle = styles.alter;
        textStyle = styles.alterText;
        loadingColor = '#444';
        break;
      case 'link':
        containerStyle = styles.link;
        textStyle = styles.linkText;
        loadingColor = '#fff';
        break;
      default:
        containerStyle = styles.default;
        textStyle = styles.defaultText;
        loadingColor = '#fff';
        break;
    }
    let sizeStyle = null;
    let textSizeStyle = null;
    switch (size) {
      case 'small':
        sizeStyle = styles.smallSize;
        textSizeStyle = styles.textSmallSize;
        break;
      default:
        break;
    }
    return (
      <Touchable
        style={[
          styles.container,
          type !== 'link' && Theme.shadowDefault,
          containerStyle,
          sizeStyle,
          style,
        ]}
        {...props}
      >
        {icon && !isLoading && (
          <Icon
            name={icon}
            style={[
              styles.text,
              Theme.textShadow,
              label ? styles.iconWithLabel : undefined,
              textStyle,
              textSizeStyle,
            ]}
            type={iconType}
          />
        )}
        {!icon ||
          (isLoading && (
            <Loading
              style={[
                label ? styles.iconWithLabel : undefined,
                { width: 16, height: 16, transform: [{ scale: 0.8 }] },
              ]}
              color={loadingColor}
              size={'small'}
            />
          ))}

        {label && (
          <Text style={[styles.text, textStyle, textSizeStyle]}>{label}</Text>
        )}
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 22,
    margin: 4,
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    height: 44,
  },
  smallSize: {
    padding: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },
  iconWithLabel: {
    paddingRight: 5,
  } as ViewStyle,
  text: {
    fontSize: 15,
  },
  textSmallSize: {
    fontSize: 12,
  },
  default: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  defaultText: {
    color: '#fff',
  },
  alter: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  alterText: {
    color: '#666',
  },
  link: {
    backgroundColor: 'transparent',
  },
  linkText: {
    color: '#fff',
  },
  primary: {
    backgroundColor: '#f59331',
  },
  primaryText: {
    color: '#fff',
  },
  danger: {
    backgroundColor: '#cf4346',
  },
  dangerText: {
    color: '#fff',
  },
  warning: {
    backgroundColor: '#ea8435',
  },
  warningText: {
    color: '#fff',
  },
  success: {
    backgroundColor: '#74cf67',
  },
  successText: {
    color: '#fff',
  },
  facebook: {
    backgroundColor: '#344e85',
  },
  facebookText: {
    color: '#fff',
  },
});
