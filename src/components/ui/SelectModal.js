import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import Touchable from '../ui/Touchable';
import PropTypes from 'prop-types';
import Modal from 'react-native-modal';
import Icon from '../ui/Icon';
import Button from './Button';
import { _ } from '../../modules/i18n/Translator';

const TAG = 'SelectModal';
export default class SelectModal extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state = {};

  render() {
    let {
      values,
      selectedValue,
      title,
      onCancel,
      isVisible,
      onValueChange
    } = this.props;
    let { width, height } = Dimensions.get('screen');

    return (
      <Modal
        isVisible={isVisible}
        onBackButtonPress={onCancel}
        onBackdropPress={onCancel}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          <ScrollView horizontal={false} style={{ maxHeight: height - 200 }}>
            {values.map((value, index) => {
              let isSelected = value.value === selectedValue;
              return (
                <Touchable
                  key={index}
                  style={styles.optionContainer}
                  onPress={() => {
                    onValueChange(value.value, index);
                  }}
                >
                  <View
                    style={[styles.option, isSelected && styles.optionActive]}
                  >
                    {value.icon && (
                      <Icon
                        style={[
                          styles.optionIcon,
                          isSelected && styles.optionIconActive
                        ]}
                        name={value.icon}
                        type={value.iconType}
                      />
                    )}
                    <View>
                      <Text
                        style={[styles.text, isSelected && styles.textActive]}
                      >
                        {value.label}
                      </Text>
                      {value.subtitle && (
                        <Text
                          style={[
                            styles.text,
                            styles.subtitle,
                            isSelected && styles.textActive
                          ]}
                        >
                          {value.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>
                </Touchable>
              );
            })}
          </ScrollView>

          <View>
            <Button label={_('Cancelar')} onPress={onCancel} type={'default'} />
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: '#444',
    fontSize: 14,
    padding: 4,
    paddingBottom: 10,
    textAlign: 'center'
  },
  modal: {
    alignItems: 'center'
  },
  modalContainer: {
    maxWidth: 300,
    padding: 5,
    width: 300,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 4
  },
  optionIcon: {
    fontSize: 30,
    marginRight: 10,
    color: '#f59331'
  },
  optionIconActive: {
    color: '#fff'
  },
  option: {
    backgroundColor: '#fafafa',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4
  },
  optionContainer: {
    marginTop: 3,
    borderRadius: 4
  },
  text: {
    color: '#444',
    fontSize: 13
  },
  subtitle: {
    color: '#777',
    fontSize: 12
  },
  textActive: {
    color: '#fff'
  },
  optionActive: {
    backgroundColor: '#f59331'
  }
});
