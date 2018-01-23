import * as React from 'react';
import {
    Platform,
    StyleProp,
    StyleSheet,
    Text,
    TextInput,
    TextInputProperties,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';

export interface InputProps extends TextInputProperties {
    value?: string;
    placeholder?: string;
    defaultValue?: string;
    hasError?: boolean;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    onChangeText?: (text: string) => void;
    useLabel?: boolean;
}

export interface State {
    value: string;
}

export default class Input extends React.Component<InputProps, State> {
    state: State = {
        value: ''
    };

    refs: {
        [string: string]: any;
        input: TextInput;
    };
    onChangeText = (text: string) => {
        let {onChangeText} = this.props;
        this.setValue(text);
        if (typeof onChangeText === 'function') {
            onChangeText(text);
        }
    };

    setValue(value: string) {
        this.setState({value});
    }

    getValue() {
        return this.state.value;
    }

    focus() {
        this.refs.input.focus();
    }

    componentDidMount() {
        let {defaultValue} = this.props;
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
            ...props
        } = this.props;

        let {value} = this.state;
        let newProps = {...props};
        newProps.value = value;
        newProps.onChangeText = this.onChangeText;

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
                        underlineColorAndroid='transparent'
                        placeholderTextColor={hasError ? 'red' : '#999'}
                        style={[styles.input, hasError && styles.inputError, style]}
                        ref='input'
                        placeholder={!useLabel ? placeholder : undefined}
                        {...newProps}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
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
        marginTop: Platform.OS === 'windows' ? 6 : 0,
        borderWidth: 0,
        borderColor: 'transparent',
        paddingLeft: 10,
        paddingRight: 10
    },
    inputError: {
        backgroundColor: 'transparent',
        color: 'red'
    }
});
