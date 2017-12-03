import React from 'react';
import { StyleSheet, View } from 'react-native';
import MessageItem from './MessageItem';
import Log from '../../modules/logger/Log';

const TAG = 'MessageCenter';
export default class MessageCenter extends React.Component {
  static counter = 0;

  state = {
    messages: []
  };

  async show(params): Promise<string> {
    MessageCenter.counter++;
    if (!params.id) {
      params.id = MessageCenter.counter.toString();
    }

    let messages = this.state.messages;
    let exist = messages.some(message => {
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

    Log.info(TAG, 'show', messages.length, MessageCenter.counter);

    return new Promise((resolve, reject) => {
      this.setState({ messages }, () => {
        resolve(params.id);
      });
    });
  }

  remove(id: string) {
    let messages = this.state.messages.filter((item: Message) => {
      return item.id !== id;
    });
    this.setState({ messages });
  }

  onHideItem(id: string) {
    let messageRef: MessageItem = this.refs[`message${id}`];
    if (messageRef) {
      messageRef.hide(() => {
        this.remove(id);
      });
    }
  }

  render() {
    let { messages } = this.state;
    let { topOffset } = this.props;
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
                onHide={this.onHideItem.bind(this, item.id)}
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
    minWidth: 200
  },
  container: {
    zIndex: 300,
    elevation: 10,
    flex: 1,
    position: 'absolute',
    right: 5,
    left: 5
  }
});
