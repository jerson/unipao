import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import Touchable from '../ui/Touchable';
import { _ } from '../../modules/i18n/Translator';
import { IntranetOptionItemModel } from '../../scenes/user/IntranetScreen';
import { Theme } from '../../themes/styles';

export interface IntranetOptionItemProps {
  item: IntranetOptionItemModel;
  onChooseItem: () => void;
}

export interface State {}

const TAG = 'IntranetOptionItem';
export default class IntranetOptionItem extends React.Component<
  IntranetOptionItemProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {};

  onPress = () => {
    let { item, onChooseItem } = this.props;
    if (item.disabled) {
      this.context.notification.show({
        type: 'warning',
        id: 'intranet',
        title: _('Esta opción no esta implementada'),
        icon: 'error-outline',
        autoDismiss: 4,
        iconType: 'MaterialIcons'
      });
      return;
    }

    if (typeof onChooseItem === 'function') {
      onChooseItem();
    }
  };

  render() {
    let { item } = this.props;

    return (
      <Touchable style={styles.button} onPress={this.onPress}>
        <View
          style={[
            styles.container,
            Theme.shadowLarge,
            item.disabled && styles.disabled
          ]}
        >
          <View style={styles.info}>
            {item.icon &&
              item.iconType && (
                <Icon
                  style={styles.icon}
                  name={item.icon}
                  type={item.iconType}
                />
              )}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
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
    // borderBottomWidth: 1,
    // borderColor: '#f1f1f1',
    flexDirection: 'row',
    borderRadius: 8,
    alignItems: 'center'
    // height: 58
  },
  disabled: {
    opacity: 0.5
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    padding: 5
  },
  icon: {
    fontSize: 30,
    padding: 5,
    width: 50,
    color: '#f59331',
    textAlign: 'center'
  },
  name: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666'
  },
  description: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999'
  }
});
