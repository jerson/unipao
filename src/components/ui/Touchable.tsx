import * as React from 'react';
import {GestureResponderEvent, StyleProp, TouchableOpacity, TouchableOpacityProperties, ViewStyle} from 'react-native';

export interface TouchableProps extends TouchableOpacityProperties {
    style?: StyleProp<ViewStyle>;
    onPress?: (event: GestureResponderEvent) => void;
}

export interface State {
}

export default class Touchable extends React.Component<TouchableProps, State> {
    render() {
        let {...props} = this.props;
        return <TouchableOpacity {...props} />;
    }
}
