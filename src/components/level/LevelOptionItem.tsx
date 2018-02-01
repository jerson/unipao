import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import Touchable from '../ui/Touchable';
import { Theme } from '../../themes/styles';
import { LevelOptionItemModel } from '../../scenes/user/intranet/LevelScreen';

export interface LevelOptionItemProps {
  item: LevelOptionItemModel;
  onChooseItem: () => void;
}

export interface State {}

const TAG = 'LevelOptionItem';
export default class LevelOptionItem extends React.Component<
  LevelOptionItemProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {};

  render() {
    let { item, onChooseItem } = this.props;

    return (
      <Touchable style={styles.button} onPress={onChooseItem}>
        <View style={[styles.container, Theme.shadowDefault]}>
          <View style={styles.info}>
            {item.icon &&
              item.iconType && (
                <Icon
                  style={styles.icon}
                  name={item.icon}
                  type={item.iconType}
                />
              )}
            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text numberOfLines={3} style={styles.description}>
                {item.description}
              </Text>
            </View>
            <View style={styles.options}>
              <Icon
                style={styles.option}
                name={'chevron-right'}
                type={'Feather'}
              />
            </View>
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 5
  },
  container: {
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    borderRadius: 4,
    alignItems: 'center'
  },
  options: {
    alignItems: 'center'
  },
  content: {
    // flex: 1,
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingRight: 5
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 70,
    padding: 5,
    paddingTop: 15,
    paddingBottom: 15
  },
  icon: {
    fontSize: 30,
    padding: 5,
    width: 50,
    textAlign: 'center',
    color: '#f59331'
  },
  option: {
    fontSize: 30,
    padding: 5,
    textAlign: 'center',
    color: '#999'
  },
  name: {
    fontSize: 14,
    color: '#666'
  },
  description: {
    fontSize: 12,
    color: '#999'
  }
});
