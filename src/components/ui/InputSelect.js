import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Touchable from './Touchable';
import Icon from './Icon';
import SelectModal from './SelectModal';

export default class InputSelect extends React.Component {
  state = {
    value: '',
    selected: {},
    isModalVisible: false
  };
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  hideModal = () => {
    this.setState({ isModalVisible: false }, () => {
      let { onSubmitEditing } = this.props;
      if (typeof onSubmitEditing === 'function') {
        onSubmitEditing();
      }
    });
  };

  onChangeSelect = itemValue => {
    this.setValue(itemValue);
    this.hideModal();
  };

  setValue(value: string) {
    let { options } = this.props;
    let selected = {};
    for (let option of options) {
      if (option.value === value) {
        selected = option;
        break;
      }
    }
    this.setState({ value, selected });
  }

  getValue() {
    return this.state.value;
  }

  focus() {
    this.setState({ isModalVisible: true });
  }

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
      useLabel,
      placeholder,
      options,
      title,
      ...props
    } = this.props;

    let newProps = { ...props };
    let { isModalVisible, selected, value } = this.state;
    newProps.value = selected.label;
    if (!useLabel) {
      newProps.placeholder = placeholder;
    }
    let titleDefault = title || 'Elige un valor';

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
            containerStyle
          ]}
        >
          <TextInput
            underlineColorAndroid="transparent"
            placeholderTextColor={hasError ? 'red' : '#999'}
            style={[styles.input, hasError && styles.inputError, style]}
            ref="input"
            {...newProps}
          />
          <Icon name={'select-arrows'} type={'Entypo'} style={styles.icon} />
          <Touchable onPress={this.toggleModal} style={styles.overlay} />
        </View>

        <SelectModal
          isVisible={isModalVisible}
          title={title}
          onCancel={this.toggleModal}
          values={options}
          onValueChange={this.onChangeSelect}
          selectedValue={selected.value}
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
    bottom: 0
  },
  icon: {
    position: 'absolute',
    top: 8,
    right: 10,
    bottom: 0,
    fontSize: 20,
    color: '#999'
  },
  label: {
    color: '#444',
    textAlign: 'center',
    padding: 4
  },
  labelError: {
    color: 'red'
  },
  inputContainer: {
    marginTop: 4,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 6
  },
  inputContainerError: {
    backgroundColor: '#ffacb6',
    borderColor: '#f35f94'
  },
  input: {
    height: 38,
    backgroundColor: 'transparent',
    color: '#444',
    borderRadius: 6,
    fontSize: 13,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10
  },
  inputError: {
    backgroundColor: 'transparent',
    color: 'red'
  }
});
