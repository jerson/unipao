import React from 'react';
import BaseModal from 'react-native-modal';

const TAG = 'Modal';
export default class Modal extends React.Component {
  render() {
    let { ...props } = this.props;

    return <BaseModal {...props} />;
  }
}
