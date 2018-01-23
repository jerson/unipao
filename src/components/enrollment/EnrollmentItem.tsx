import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import * as PropTypes from 'prop-types';

const TAG = 'EnrollmentItem';
export default class EnrollmentItem extends React.Component {
    static contextTypes = {
        notification: PropTypes.object.isRequired
    };

    state = {
        expanded: false
    };

    toggle = () => {
        this.setState({expanded: !this.state.expanded});
    };

    render() {
        let {expanded} = this.state;
        let {enrollment} = this.props;
        enrollment = enrollment || {};

        return (
            <View style={[styles.container]}>
                <View style={styles.item}>
                    <Text style={styles.text}>
                        {(enrollment.NRC || enrollment.NCR).toString().trim()}
                    </Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.text}>
                        {(enrollment.CRED || '0').toString().trim()}
                    </Text>
                </View>
                <View style={styles.item}>
                    <Text style={styles.text}>
                        {(enrollment.TPLA || '0').toString().trim()}
                    </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingBottom: 3,
        justifyContent: 'space-between'
    },
    item: {
        flex: 1,
        alignItems: 'center'
    },
    text: {
        color: '#999',
        fontSize: 12
    }
});
