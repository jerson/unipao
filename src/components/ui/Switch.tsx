import * as React from 'react';
import {Switch as SwitchBase, SwitchProperties} from 'react-native';

export interface SwitchProps extends SwitchProperties {
    activeColor?: string;
}

export interface State {
}

export default class Switch extends React.Component<SwitchProps, State> {
    render() {
        let {activeColor, ...props} = this.props;

        activeColor = activeColor || '#d4d4d4';
        return (
            <SwitchBase
                thumbTintColor={'#fff'}
                onTintColor={'#f59331'}
                tintColor={'rgba(0,0,0,0.1)'}
                {...props}
            />
        );
    }
}
