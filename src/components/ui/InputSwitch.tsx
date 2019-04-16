import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  SwitchProperties,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Switch from './Switch';
import { Theme } from '../../themes/styles';

export interface InputSwitchProps extends SwitchProperties {
  defaultValue?: boolean;
  placeholder?: string;
  hasError?: boolean;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onChangeText?: (text: string) => void;
  useLabel?: boolean;
  center?: boolean;
}

export interface State {
  value?: boolean;
}

export default class InputSwitch extends React.Component<
  InputSwitchProps,
  State
> {
  state: State = {
    value: false,
  };
  onValueChange = (text: boolean) => {
    const { onValueChange } = this.props;
    this.setValue(text);
    if (typeof onValueChange === 'function') {
      onValueChange(text);
    }
  };

  setValue(value: boolean) {
    this.setState({ value });
  }

  getValue() {
    return this.state.value;
  }

  focus() {}

  componentDidMount() {
    const { defaultValue } = this.props;
    if (defaultValue) {
      this.setValue(defaultValue);
    }
  }

  render() {
    const {
      defaultValue,
      hasError,
      labelStyle,
      containerStyle,
      style,
      center,
      useLabel,
      placeholder,
      ...props
    } = this.props;

    const newProps = { ...props };
    newProps.value = this.state.value;
    newProps.onValueChange = this.onValueChange;

    return (
      <View style={[styles.container, center && styles.containerCenter]}>
        <View
          style={[
            styles.inputContainer,
            hasError && styles.inputContainerError,
            containerStyle,
          ]}
        >
          <Switch {...newProps} />
          {useLabel && (
            <Text
              style={[
                styles.label,
                Theme.textShadow,
                hasError && styles.labelError,
                labelStyle,
              ]}
            >
              {placeholder}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  containerCenter: {
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    textAlign: 'left',
    padding: 4,
    paddingLeft: 10,
    backgroundColor: 'transparent',
  },
  labelError: {
    color: '#f35f94',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  inputContainerError: {},
});
