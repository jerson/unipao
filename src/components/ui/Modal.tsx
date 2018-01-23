import * as React from 'react';
import BaseModal, { ModalProps } from 'react-native-modal';

export interface State {}

const TAG = 'Modal';
export default class Modal extends React.Component<ModalProps, State> {
  render() {
    let { ...props } = this.props;

    return <BaseModal {...props} />;
  }
}
