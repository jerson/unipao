import * as React from 'react';
import Select from '../ui/Select';
import Storage from '../../modules/storage/PreferencesStorage';
import PreferenceItem, { PreferenceItemProps } from './PreferenceItem';
import Log from '../../modules/logger/Log';
import { InputSelectOption } from 'components/ui/InputSelect';

export interface PreferenceItemSelectProps extends PreferenceItemProps {
  onChange: (value: string) => void;
  values: InputSelectOption[];
  name: string;
}

export interface State {
  value: string;
}

export default class PreferenceItemSelect extends React.Component<
  PreferenceItemSelectProps,
  State
> {
  state: State = {
    value: ''
  };

  onChange = (value: string) => {
    let { onChange } = this.props;
    if (value !== this.state.value) {
      this.setState({ value }, () => {
        if (typeof onChange === 'function') {
          onChange(value);
        }
      });
    }
  };

  updateStorage() {
    let { name } = this.props;
    let { value } = this.state;
    Storage.set(name, value);
  }

  componentDidUpdate(prevProps: PreferenceItemSelectProps, prevState: State) {
    if (this.state.value !== prevState.value && prevState.value) {
      this.updateStorage();
    }
  }

  getDefaultValue() {
    return Storage.getDefault(this.props.name).toString();
  }

  async componentDidMount() {
    let defaultValue = this.getDefaultValue();
    let value = defaultValue;

    if (!value) {
      try {
        let data = await Storage.get(this.props.name);
        value = data ? data.toString() : defaultValue;
      } catch (e) {
        Log.warn(e);
        value = defaultValue;
      }
    }

    this.setState({ value });
  }

  render() {
    let { values, title, onChange, ...props } = this.props;
    let { value } = this.state;

    return (
      <PreferenceItem title={title} {...props}>
        <Select
          values={values}
          title={title}
          onValueChange={this.onChange}
          selectedValue={value}
        />
      </PreferenceItem>
    );
  }
}
