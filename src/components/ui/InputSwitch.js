import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Switch from './Switch';
import { Theme } from '../../themes/styles';

export default class InputSwitch extends React.Component {
  state = {
    value: false
  };
  onValueChange = (text: string) => {
    let { onValueChange } = this.props;
    this.setValue(text);
    if (typeof onValueChange === 'function') {
      onValueChange(text);
    }
  };

  setValue(value: string) {
    this.setState({ value });
  }

  getValue() {
    return this.state.value;
  }

  focus() {}

  componentDidMount() {
    let { defaultValue } = this.props;
    if (defaultValue) {
      this.setValue(defaultValue);
    }
  }

  render() {
    let {
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

    let newProps = { ...props };
    newProps.value = this.state.value;
    newProps.onValueChange = this.onValueChange;

    return (
      <View style={[styles.container, center && styles.containerCenter]}>
        <View
          style={[
            styles.inputContainer,
            hasError && styles.inputContainerError,
            containerStyle
          ]}
        >
          <Switch {...newProps} />
          {useLabel && (
            <Text
              style={[
                styles.label,
                Theme.textShadow,
                hasError && styles.labelError,
                labelStyle
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
    alignItems: 'center'
  },
  label: {
    color: '#fff',
    textAlign: 'left',
    padding: 4,
    paddingLeft: 10,
    backgroundColor: 'transparent'
  },
  labelError: {
    color: '#f35f94'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10
  },
  inputContainerError: {}
});
