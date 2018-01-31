import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native';
import Icon, { IconType } from './Icon';
import Touchable from './Touchable';
import Loading from './Loading';
import { Theme } from '../../themes/styles';

export type AlertMessageType =
  | 'default'
  | 'primary'
  | 'danger'
  | 'warning'
  | 'info'
  | 'success';

export interface AlertMessageProps {
  title?: string;
  message?: string;
  icon?: string;
  allowClose?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconType?: IconType;
  type?: AlertMessageType;
}

export interface State {
  isVisible: boolean;
}

export default class AlertMessage extends React.Component<
  AlertMessageProps,
  State
> {
  state: State = {
    isVisible: true
  };

  close = () => {
    this.setState({ isVisible: false });
  };

  render() {
    let {
      message,
      isLoading,
      icon,
      iconType,
      allowClose,
      iconStyle,
      textStyle,
      title,
      titleStyle,
      type,
      style
    } = this.props;

    let { isVisible } = this.state;

    if (!isVisible) {
      return null;
    }

    let typeContainerStyle = null;
    let typeIconColor = '';
    let typeTitleStyle = null;
    let typeTextStyle = null;

    switch (type) {
      case 'default':
      default:
        typeIconColor = '#444';
        break;
      case 'primary':
        typeContainerStyle = styles.containerPrimary;
        typeIconColor = '#fff';
        typeTextStyle = styles.textPrimary;
        typeTitleStyle = styles.titlePrimary;
        break;
      case 'danger':
        typeContainerStyle = styles.containerDanger;
        typeIconColor = '#fff';
        typeTextStyle = styles.textDanger;
        typeTitleStyle = styles.titleDanger;
        break;
      case 'warning':
        typeContainerStyle = styles.containerWarning;
        typeIconColor = '#fff';
        typeTextStyle = styles.textWarning;
        typeTitleStyle = styles.titleWarning;
        break;
      case 'info':
        typeContainerStyle = styles.containerInfo;
        typeIconColor = '#fff';
        typeTextStyle = styles.textInfo;
        typeTitleStyle = styles.titleInfo;
        break;
      case 'success':
        typeContainerStyle = styles.containerSuccess;
        typeIconColor = '#fff';
        typeTextStyle = styles.textSuccess;
        typeTitleStyle = styles.titleSuccess;
        break;
    }
    let sizeIcon = 30;

    return (
      <View
        style={[styles.container, Theme.shadowLarge, typeContainerStyle, style]}
      >
        {isLoading && (
          <Loading
            style={[styles.icon]}
            color={typeIconColor}
            size={sizeIcon}
          />
        )}
        {icon &&
          !isLoading && (
            <Icon
              style={[styles.icon, { color: typeIconColor }, iconStyle]}
              type={iconType}
              name={icon}
              size={sizeIcon}
            />
          )}
        <View style={styles.alert}>
          {title && (
            <Text style={[styles.title, typeTitleStyle, titleStyle]}>
              {title}
            </Text>
          )}
          {message && (
            <Text style={[styles.text, typeTextStyle, textStyle]}>
              {message}
            </Text>
          )}
        </View>
        {allowClose && (
          <Touchable onPress={this.close}>
            <Icon
              style={[styles.icon, { color: typeIconColor }, iconStyle]}
              type={iconType}
              name={'close'}
              size={15}
            />
          </Touchable>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 6
  },
  container: {
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerPrimary: {
    backgroundColor: '#0d61ac'
  },
  containerDanger: {
    backgroundColor: '#cf4346'
  },
  containerWarning: {
    backgroundColor: '#f59331'
  },
  containerInfo: {
    backgroundColor: '#2e91cf'
  },
  containerSuccess: {
    backgroundColor: '#74cf67'
  },
  alert: { flex: 1 },
  text: {
    fontSize: 13,
    color: '#000'
  },
  textPrimary: {
    color: '#fff'
  },
  textDanger: {
    color: '#fff'
  },
  textWarning: {
    color: '#fff'
  },
  textInfo: {
    color: '#fff'
  },
  textSuccess: {
    color: '#fff'
  },
  title: {
    fontSize: 15,
    color: '#fff'
  },
  titlePrimary: {
    color: '#fff'
  },
  titleDanger: {
    color: '#fff'
  },
  titleWarning: {
    color: '#fff'
  },
  titleInfo: {
    color: '#fff'
  },
  titleSuccess: {
    color: '#fff'
  }
});
