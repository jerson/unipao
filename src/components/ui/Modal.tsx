import * as React from 'react';
import BaseModal, { ModalProps as Props } from 'react-native-modal';

export interface ModalProps extends Props {}

export interface State {}

const TAG = 'Modal';
export default class Modal extends React.Component<ModalProps, State> {
  render() {
    let { ...props } = this.props;

    return <BaseModal {...props} />;
  }
}
