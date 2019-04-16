import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import MessageItem, { Message } from './MessageItem';
import Log from '../../modules/logger/Log';

export interface MessageCenterProps {
  topOffset?: number;
}

export interface State {
  messages: Message[];
}

let counter = 0;
const TAG = 'MessageCenter';
export default class MessageCenter extends React.Component<
  MessageCenterProps,
  State
> {
  static counter = 0;

  state: State = {
    messages: [],
  };

  refs: any;

  async show(params: Message): Promise<string> {
    counter++;
    if (!params.id) {
      params.id = counter.toString();
    }

    let messages = this.state.messages;
    const exist = messages.some(message => {
      return params.id === message.id;
    });

    if (!exist) {
      messages = [...messages, params];
    } else {
      messages = messages.map(message => {
        if (params.id === message.id) {
          return params;
        }
        return message;
      });
    }

    Log.info(TAG, 'show', messages.length, counter);

    return new Promise<string>((resolve, reject) => {
      this.setState({ messages }, () => {
        resolve(params.id);
      });
    });
  }

  remove(id: string) {
    const messages = this.state.messages.filter((item: Message) => {
      return item.id !== id;
    });
    this.setState({ messages });
  }

  onHideItem(id: string) {
    const messageRef: MessageItem = this.refs[`message${id}`];
    if (messageRef) {
      messageRef.hide(() => {
        this.remove(id);
      });
    }
  }

  render() {
    const { messages } = this.state;
    const { topOffset } = this.props;
    let top = topOffset || 5;

    top += 50 + 20;

    return (
      <View style={[styles.container, { top }]}>
        <View style={[styles.content]}>
          {messages.map((item, index) => {
            return (
              <MessageItem
                key={item.id}
                ref={`message${item.id}`}
                onHide={this.onHideItem.bind(this, item.id!)}
                item={item}
              />
            );
          })}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    zIndex: 100,
    minWidth: 200,
  },
  container: {
    zIndex: 300,
    elevation: 10,
    flex: 1,
    position: 'absolute',
    right: 5,
    left: 5,
  },
});
