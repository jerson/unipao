import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Touchable from './Touchable';
import { ModalProps as Props } from 'react-native-modal';

export interface ModalProps extends Props {
  isVisible: boolean;
}

export interface State {
  px: number;
  py: number;
  loaded: boolean;
}

const TAG = 'ModalWindows';
export default class ModalWindows extends React.Component<ModalProps, State> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state: State = {
    px: 0,
    py: 0,
    loaded: false
  };

  refs: any;

  componentDidUpdate(prevProps: ModalProps, prevState: State) {
    if (this.props.isVisible) {
      setTimeout(() => {
        this.refs.container &&
          this.refs.container.measure(
            (
              ox: number,
              oy: number,
              width: number,
              height: number,
              px: number,
              py: number
            ) => {
              if (this.state.loaded) {
                return;
              }
              this.setState({ px, py, loaded: true });
            }
          );
      }, 100);
    }
  }

  render() {
    let {
      onBackButtonPress,
      onBackdropPress,
      isVisible,
      children
    } = this.props;
    let { height, width } = Dimensions.get('window');
    let { py, px } = this.state;

    if (!isVisible) {
      return null;
    }

    return (
      <View
        ref={'container'}
        style={[
          styles.absolute,
          styles.modal,
          { width, height, left: px * -1, top: py * -1 }
        ]}
      >
        <Touchable
          onPress={onBackdropPress}
          style={[styles.absolute, styles.backdrop]}
        />
        <View style={styles.container}>{children}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  absolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9000,
    elevation: 9000
  }
});
