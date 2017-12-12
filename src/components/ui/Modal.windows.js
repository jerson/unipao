import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Touchable from './Touchable';

const TAG = 'ModalWindows';
export default class ModalWindows extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {
    px: 0,
    py: 0,
    loaded: false
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isVisible) {
      setTimeout(() => {
          this.container && this.container.measure((ox, oy, width, height, px, py) => {
          if (this.state.loaded) {
            return;
          }
          this.setState({ px, py, loaded: true });
        });
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
        ref={ref => {
          this.container = ref;
        }}
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
    zIndex: 1000,
    elevation: 100
  }
});
