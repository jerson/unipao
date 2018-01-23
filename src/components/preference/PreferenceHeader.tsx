import * as React from 'react';
import {StyleSheet, Text, View, StyleProp, ViewStyle} from 'react-native';



export interface PreferenceHeaderProps {
    style?:StyleProp<ViewStyle>;
    title:string;
}

export interface State { 

}

export default class PreferenceHeader extends React.Component<PreferenceHeaderProps,State> {
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <Text style={[styles.title]}>{this.props.title}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 12
        // backgroundColor: 'rgba(0,0,0,0.05)'
    },
    title: {
        fontSize: 15,
        color: '#f59331'
    }
});
