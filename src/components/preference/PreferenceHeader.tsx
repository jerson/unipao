import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default class PreferenceHeader extends React.Component {
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
