import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import Touchable from '../ui/Touchable';
import { _ } from '../../modules/i18n/Translator';

export interface IntranetItemProps {
  intranet: any;
  onChooseItem: () => void;
}

export interface State {}

const TAG = 'IntranetItem';
export default class IntranetItem extends React.Component<
  IntranetItemProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {};

  onPress = () => {
    let { intranet, onChooseItem } = this.props;
    if (intranet.disabled) {
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
    let { intranet } = this.props;

    return (
      <Touchable onPress={this.onPress}>
        <View style={[styles.container, intranet.disabled && styles.disabled]}>
          <View style={styles.info}>
            <Icon
              style={styles.icon}
              name={intranet.icon}
              type={intranet.iconType}
            />

            <Text style={styles.name}>{intranet.name}</Text>
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    flexDirection: 'row',
    alignItems: 'center',
    height: 58
  },
  disabled: {
    opacity: 0.5
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    fontSize: 30,
    padding: 5,
    width: 50,
    color: '#f59331',
    textAlign: 'center'
  },
  name: {
    fontSize: 14,
    color: '#666'
  }
});
