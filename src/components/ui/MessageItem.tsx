import * as React from 'react';
import { Animated, LayoutChangeEvent } from 'react-native';
import Touchable from './Touchable';
import Log from '../../modules/logger/Log';
import AlertMessage, {
  AlertMessageProps,
  AlertMessageType
} from './AlertMessage';
import EndCallback = Animated.EndCallback;
import CompositeAnimation = Animated.CompositeAnimation;

export interface Message extends AlertMessageProps {
  id?: string;
  title?: string;
  icon?: string;
  message?: string;
  isLoading?: boolean;
  autoDismiss?: number;
  type?: AlertMessageType;
}

export interface MessageItemProps {
  item: Message;
  onHide: () => void;
}

export interface State {
  top: Animated.Value;
  fade: Animated.Value;
  itemHeight: number;
}

export default class MessageItem extends React.Component<
  MessageItemProps,
  State
> {
  state: State = {
    top: new Animated.Value(-100),
    fade: new Animated.Value(0),
    itemHeight: 0
  };

  animation: any = undefined;
  timeoutDismiss: number = 0;

  onLayout = (event: LayoutChangeEvent) => {
    let itemHeight = event.nativeEvent.layout.height;
    this.setState({ itemHeight });
    Log.info('[MessageItem]', itemHeight);
  };

  show() {
    if (this.animation) {
      this.animation.stop();
    }
    requestAnimationFrame(() => {
      this.animation = Animated.parallel([
        Animated.timing(this.state.fade, {
          toValue: 1,
          duration: 600
        }),
        Animated.spring(this.state.top, {
          toValue: 0,
          friction: 8
        })
      ]);
      this.animation.start();
    });
  }

  hide(cb: EndCallback) {
    let offset = this.state.itemHeight < 1 ? 50 : this.state.itemHeight;

    if (this.animation) {
      this.animation.stop();
    }
    requestAnimationFrame(() => {
      this.animation = Animated.parallel([
        Animated.timing(this.state.fade, {
          toValue: 0,
          duration: 200
        }),
        Animated.spring(this.state.top, {
          toValue: offset * -1,
          friction: 8
        })
      ]);
      this.animation.start(cb);
    });
  }

  componentDidMount() {
    this.show();
    this.autoDismissSetup();
  }

  componentWillUnmount() {
    if (this.animation) {
      this.animation.stop();
    }
  }

  autoDismissSetup() {
    let item = this.props.item || {};
    if (this.timeoutDismiss) {
      clearTimeout(this.timeoutDismiss);
    }

    if (item.autoDismiss) {
      this.timeoutDismiss = setTimeout(() => {
        this.props.onHide();
      }, item.autoDismiss * 1000);
    }
  }

  componentDidUpdate(prevProps: MessageItemProps, prevState: State) {
    let autoDismissReload = false;
    let item = this.props.item || {};
    let prevItem = prevProps.item || {};
    if (prevItem.message !== item.message) {
      autoDismissReload = true;
    } else if (prevItem.autoDismiss !== item.autoDismiss) {
      autoDismissReload = true;
    } else if (prevItem.isLoading !== item.isLoading) {
      autoDismissReload = true;
    }

    autoDismissReload && this.autoDismissSetup();
  }

  render() {
    let { item, onHide, ...props } = this.props;
    let { fade, top } = this.state;
    let { id, autoDismiss, ...messageProps } = item;

    return (
      <Animated.View
        style={{ elevation: 8, zIndex: 8, opacity: fade, marginTop: top }}
      >
        <Touchable onLayout={this.onLayout} onPress={onHide}>
          <AlertMessage {...messageProps} />
        </Touchable>
      </Animated.View>
    );
  }
}
