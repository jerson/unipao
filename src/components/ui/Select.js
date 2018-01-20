import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from './Icon';
import Touchable from './Touchable';
import SelectModal from './SelectModal';
import { Theme } from '../../themes/styles';

export default class Select extends React.Component {
  state = {
    showModal: false,
    selectedLabel: 'Default',
    selectedValue: ''
  };
  toggle = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  onValueChange = (value, index) => {
    this.setState({
      selectedValue: value,
      selectedLabel: this.props.values[index].label,
      showModal: false
    });
  };

  getValue() {
    return this.state.selectedValue;
  }

  componentDidUpdate(prevProps, prevState) {
    let { selectedValue } = this.props;
    if (selectedValue !== prevProps.selectedValue) {
      this.setState({
        selectedValue: selectedValue,
        selectedLabel: this.getLabelForValue(selectedValue)
      });
    }
    if (this.state.selectedValue !== prevState.selectedValue) {
      if (typeof this.props.onValueChange === 'function') {
        this.props.onValueChange(this.state.selectedValue);
      }
    }
  }

  getLabelForValue(value) {
    let label = '';
    this.props.values.forEach(item => {
      if (item.value === value) {
        label = item.label;
      }
    });

    return label;
  }

  componentDidMount() {
    let { selectedValue } = this.props;
    if (selectedValue) {
      this.setState({
        selectedLabel: this.getLabelForValue(selectedValue)
      });
    }
  }

  render() {
    let { selectedLabel } = this.state;
    let { values, title, selectedValue } = this.props;

    return (
      <View>
        <Touchable style={[styles.selectedContainer]} onPress={this.toggle}>
          <View style={[styles.selected, Theme.shadowDefault]}>
            <Text style={styles.label}>{this.state.selectedLabel}</Text>
            <Icon style={styles.icon} name="arrow-drop-down" />
          </View>
        </Touchable>

        <SelectModal
          isVisible={this.state.showModal}
          title={title}
          onCancel={this.toggle}
          onSucess={this.toggle}
          values={values}
          onValueChange={this.onValueChange}
          selectedValue={selectedValue}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  selectedContainer: {},
  selected: {
    padding: 10,
    paddingLeft: 20,
    // borderColor: 'rgba(0,0,0,0.1)',
    // borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#999',
    overflow: 'visible',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginLeft: 4,
    fontSize: 20,
    height: 20,
    width: 20,
    color: '#fff'
  },
  label: {
    color: '#fff',
    fontSize: 13
  }
});
