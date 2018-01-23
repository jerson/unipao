import * as React from 'react';
import {Dimensions, Keyboard, LayoutAnimation, Platform, StyleSheet, View} from 'react-native';

export interface KeyboardSpacerProps {
    [key: string]: any;
}

export interface State {
    [key: string]: any;
}

export default class KeyboardSpacer extends React.Component<KeyboardSpacerProps,
    State> {
    render() {
        if (Platform.OS !== 'ios') {
            return null;
        }

        return <KeyboardSpacerBase/>;
    }
}

class KeyboardSpacerBase extends React.Component<KeyboardSpacerProps, State> {
    static defaultProps = {
        topSpacing: 0,
        onToggle: () => null
    };
    private _listeners: any;
    private _updateKeyboardSpace: any;
    private _resetKeyboardSpace: any;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            keyboardSpace: 0,
            isKeyboardOpened: false
        };
        this._listeners = null;
        this._updateKeyboardSpace = this.updateKeyboardSpace.bind(this);
        this._resetKeyboardSpace = this.resetKeyboardSpace.bind(this);
    }

    componentDidMount() {
        const updateListener =
            Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
        const resetListener =
            Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
        this._listeners = [
            Keyboard.addListener(updateListener, this._updateKeyboardSpace),
            Keyboard.addListener(resetListener, this._resetKeyboardSpace)
        ];
    }

    componentWillUnmount() {
        this._listeners.forEach((listener: any) => listener.remove());
    }

    updateKeyboardSpace(event: any) {
        if (!event.endCoordinates) {
            return;
        }

        let animationConfig: any = defaultAnimation;
        if (Platform.OS === 'ios') {
            animationConfig = LayoutAnimation.create(
                event.duration,
                LayoutAnimation.Types[event.easing],
                LayoutAnimation.Properties.opacity
            );
        }
        LayoutAnimation.configureNext(animationConfig);

        // get updated on rotation
        const screenHeight = Dimensions.get('window').height;
        // when external physical keyboard is connected
        // event.endCoordinates.height still equals virtual keyboard height
        // however only the keyboard toolbar is showing if there should be one
        const keyboardSpace =
            screenHeight - event.endCoordinates.screenY + this.props.topSpacing;
        this.setState(
            {
                keyboardSpace,
                isKeyboardOpened: true
            },
            this.props.onToggle(true, keyboardSpace)
        );
    }

    resetKeyboardSpace(event: any) {
        let animationConfig: any = defaultAnimation;
        if (Platform.OS === 'ios') {
            animationConfig = LayoutAnimation.create(
                event.duration,
                LayoutAnimation.Types[event.easing],
                LayoutAnimation.Properties.opacity
            );
        }
        LayoutAnimation.configureNext(animationConfig);

        this.setState(
            {
                keyboardSpace: 0,
                isKeyboardOpened: false
            },
            this.props.onToggle(false, 0)
        );
    }

    render() {
        return (
            <View
                style={[
                    styles.container,
                    {height: this.state.keyboardSpace},
                    this.props.style
                ]}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        left: 0,
        right: 0,
        bottom: 0
    }
});

// From: https://medium.com/man-moon/writing-modern-react-native-ui-e317ff956f02
const defaultAnimation = {
    duration: 500,
    create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity
    },
    update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 200
    }
};
