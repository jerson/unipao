import * as React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Touchable from './Touchable';
import Icon from './Icon';
import { InputProps } from './Input';

const moment = require('moment');

export interface InputDateProps extends InputProps {
  minimumDate?: Date;
}

export interface State {
  value?: Date;
  isVisiblePicker?: boolean;
}

export default class InputDate extends React.Component<InputDateProps, State> {
  state: State = {
    value: undefined,
    isVisiblePicker: false,
  };

  refs: any;
  togglePicker = () => {
    this.setState({ isVisiblePicker: !this.state.isVisiblePicker });
  };
  datePicked = (date: Date) => {
    this.setValue(date);
    this.togglePicker();
  };
  dateCancel = (date: Date) => {
    this.togglePicker();
  };

  setValue(value: Date) {
    this.setState({ value });
  }

  getValue() {
    return this.state.value;
  }

  focus() {
    this.refs.input.focus();
  }

  componentDidMount() {
    const { defaultValue } = this.props;
    if (defaultValue) {
      const value = moment(defaultValue, 'DD/MM/YYYY').toDate();
      this.setValue(value);
    }
  }

  render() {
    const {
      hasError,
      labelStyle,
      containerStyle,
      style,
      useLabel,
      placeholder,
      minimumDate,
      ...props
    } = this.props;

    const newProps = { ...props };
    const { isVisiblePicker, value } = this.state;
    if (value) {
      newProps.value = moment(value).format('DD/MM/YYYY');
    }

    return (
      <View style={[styles.container]}>
        {useLabel && (
          <Text
            style={[styles.label, hasError && styles.labelError, labelStyle]}
          >
            {placeholder}
          </Text>
        )}
        <View
          style={[
            styles.inputContainer,
            hasError && styles.inputContainerError,
            containerStyle,
          ]}
        >
          <TextInput
            underlineColorAndroid="transparent"
            editable={false}
            placeholderTextColor={hasError ? 'red' : '#999'}
            style={[styles.input, hasError && styles.inputError, style]}
            ref="input"
            placeholder={!useLabel ? placeholder : undefined}
            {...newProps}
          />
          <Icon name={'date-range'} style={styles.icon} />
          <Touchable onPress={this.togglePicker} style={styles.overlay} />
        </View>
        <DateTimePicker
          date={value}
          isVisible={isVisiblePicker}
          onConfirm={this.datePicked}
          onCancel={this.dateCancel}
          is24Hour={false}
          mode={'date'}
          minimumDate={minimumDate}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  icon: {
    position: 'absolute',
    top: 6,
    right: 5,
    bottom: 0,
    fontSize: 25,
    color: '#999',
  },
  label: {
    color: '#444',
    textAlign: 'center',
    padding: 4,
  },
  labelError: {
    color: 'red',
  },
  inputContainer: {
    marginTop: 4,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 6,
  },
  inputContainerError: {
    backgroundColor: '#ffacb6',
    borderColor: '#f35f94',
  },
  input: {
    height: 38,
    backgroundColor: 'transparent',
    color: '#444',
    borderRadius: 6,
    fontSize: 13,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10,
  },
  inputError: {
    backgroundColor: 'transparent',
    color: 'red',
  },
});
