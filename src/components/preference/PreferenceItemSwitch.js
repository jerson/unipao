import React from 'react';
import Switch from '../ui/Switch';
import Storage from '../../modules/storage/PreferencesStorage';
import PreferenceItem from './PreferenceItem';
import Log from '../../modules/logger/Log';

export default class PreferenceItemSwitch extends React.Component {
  state = {
    value: false
  };

  onChange = value => {
    let { onChange } = this.props;
    this.setState({ value });
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  updateStorage() {
    Storage.set(this.props.name, this.state.value);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.value !== prevState.value) {
      this.updateStorage();
    }
  }

  getDefaultValue() {
    return Storage.getDefault(this.props.name);
  }

  async componentDidMount() {
    let defaultValue = this.getDefaultValue();
    let value = defaultValue;
    try {
      let data = await Storage.get(this.props.name);
      value = typeof data === 'boolean' ? data : defaultValue;
    } catch (e) {
      Log.warn(e);
    }

    this.setState({ value });
  }

  render() {
    let { onChange, ...props } = this.props;

    return (
      <PreferenceItem {...props}>
        <Switch onValueChange={this.onChange} value={this.state.value} />
      </PreferenceItem>
    );
  }
}
