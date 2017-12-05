import React from 'react';

export default class LinearGradientWindows extends React.Component {
    render() {
        let {colors,...props} = this.props;
        return (
            <View {...props}/>
        );
    }
}
