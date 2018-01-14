import React from 'react';
import { Clipboard, Linking, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import Touchable from '../ui/Touchable';
import { _ } from '../../modules/i18n/Translator';
import Log from '../../modules/logger/Log';

const TAG = 'SyllableItem';
export default class SyllableItem extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state = {};
  onPress = () => {
    let { syllable } = this.props;

    this.openRemoteLink(syllable.url);
  };

  openRemoteLink(url) {
    this.context.notification.show({
      type: 'warning',
      id: 'browser',
      message: _('Abriendo url externa'),
      icon: 'file-download',
      autoDismiss: 4,
      iconType: 'MaterialIcons'
    });
    setTimeout(() => {
      this.openExternalLink(url);
    }, 2000);
  }

  async openExternalLink(url) {
    try {
      let supported = await Linking.canOpenURL(url);

      if (!supported) {
        Clipboard.setString(url);
        this.context.notification.show({
          id: 'browser',
          title: _('Error al abrir url'),
          message: _(
            'Para continuar, Pega el enlace que ya esta en tu portapapeles a tu navegador'
          ),
          icon: 'file-download',
          level: 'warning',
          autoDismiss: 5
        });
        return;
      }
      return Linking.openURL(url);
    } catch (e) {
      Log.error('An error occurred', e);
    }
  }

  render() {
    let { syllable } = this.props;

    return (
      <Touchable onPress={this.onPress}>
        <View style={[styles.container]}>
          <View style={styles.info}>
            <Text style={styles.name}>{syllable.name}</Text>
            <Text style={styles.name}>{syllable.url}</Text>
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
  info: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  name: {
    fontSize: 14,
    color: '#666'
  }
});
