import * as React from 'react';
import Switch from '../ui/Switch';
import Storage from '../../modules/storage/PreferencesStorage';
import PreferenceItem, { PreferenceItemProps } from './PreferenceItem';
import Log from '../../modules/logger/Log';

export interface PreferenceItemSwitchProps extends PreferenceItemProps {
  onChange: (value: boolean) => void;
  name: string;
}

export interface State {
  value: boolean;
}

export default class PreferenceItemSwitch extends React.Component<
  PreferenceItemSwitchProps,
  State
> {
  state: State = {
    value: false,
  };

  onChange = (value: boolean) => {
    const { onChange } = this.props;
    this.setState({ value });
    if (typeof onChange === 'function') {
      onChange(value);
    }
  };

  updateStorage() {
    Storage.set(this.props.name, this.state.value);
  }

  componentDidUpdate(prevProps: PreferenceItemSwitchProps, prevState: State) {
    if (this.state.value !== prevState.value) {
      this.updateStorage();
    }
  }

  getDefaultValue(): boolean {
    return !!Storage.getDefault(this.props.name);
  }

  async componentDidMount() {
    const defaultValue = this.getDefaultValue();
    let value = defaultValue;
    try {
      const data = await Storage.get(this.props.name);
      value = typeof data === 'boolean' ? data : defaultValue;
    } catch (e) {
      Log.warn(e);
    }

    this.setState({ value });
  }

  render() {
    const { onChange, ...props } = this.props;

    return (
      <PreferenceItem {...props}>
        <Switch onValueChange={this.onChange} value={this.state.value} />
      </PreferenceItem>
    );
  }
}
