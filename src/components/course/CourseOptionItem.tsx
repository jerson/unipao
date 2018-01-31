import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Icon from '../ui/Icon';
import Touchable from '../ui/Touchable';
import { _ } from '../../modules/i18n/Translator';
import { CourseItemModel } from '../../scenes/user/intranet/CourseScreen';

export interface CourseOptionItemProps {
  option: CourseItemModel;
  onChooseItem: () => void;
}

export interface State {}

const TAG = 'CourseOptionItem';
export default class CourseOptionItem extends React.Component<
  CourseOptionItemProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {};

  onPress = () => {
    let { option, onChooseItem } = this.props;
    if (option.disabled) {
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
    let { option } = this.props;

    return (
      <Touchable onPress={this.onPress}>
        <View style={[styles.container, option.disabled && styles.disabled]}>
          <View style={styles.info}>
            {option.icon &&
              option.iconType && (
                <Icon
                  style={styles.icon}
                  name={option.icon}
                  type={option.iconType}
                />
              )}

            <Text style={styles.name}>{option.name}</Text>
          </View>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#fafafa',
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
    fontSize: 28,
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
