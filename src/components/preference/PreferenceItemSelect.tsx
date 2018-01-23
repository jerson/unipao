import * as React from 'react';
import Select from '../ui/Select';
import Storage from '../../modules/storage/PreferencesStorage';
import PreferenceItem from './PreferenceItem';
import Log from '../../modules/logger/Log';

export default class PreferenceItemSelect extends React.Component {
    state = {
        value: ''
    };

    onChange = value => {
        let {onChange} = this.props;
        if (value !== this.state.value) {
            this.setState({value}, () => {
                if (typeof onChange === 'function') {
                    onChange(value);
                }
            });
        }
    };

    updateStorage() {
        let {name, value} = this.props;
        Storage.set(name, value);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.value !== prevState.value && prevState.value) {
            this.updateStorage();
        }
    }

    getDefaultValue() {
        return Storage.getDefault(this.props.name);
    }

    async componentDidMount() {
        let defaultValue = this.getDefaultValue();
        let value = this.props.value;

        if (!value) {
            try {
                let data = await Storage.get(this.props.name);
                value = data ? data : defaultValue;
            } catch (e) {
                Log.warn(e);
                value = defaultValue;
            }
        }

        this.setState({value});
    }

    render() {
        let {values, title, onChange, ...props} = this.props;
        let {value} = this.state;

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
