import * as React from 'react';
import { Clipboard, Linking, StyleSheet, Text, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Touchable from '../ui/Touchable';
import { _ } from '../../modules/i18n/Translator';
import Log from '../../modules/logger/Log';
import Icon from '../ui/Icon';
import { SyllableModel } from '../../scraping/student/intranet/Course';

export interface SyllableItemProps {
  syllable: SyllableModel;
}

export interface State {}

const TAG = 'SyllableItem';
export default class SyllableItem extends React.Component<
  SyllableItemProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {};
  onPress = () => {
    let { syllable } = this.props;

    this.openRemoteLink(syllable.url);
  };

  openRemoteLink(url: string) {
    this.context.notification.show({
      type: 'warning',
      id: 'browser',
      message: _('Abriendo enlace en tu navegador'),
      isLoading: true,
      autoDismiss: 4
    });
    setTimeout(() => {
      this.openExternalLink(url);
    }, 2000);
  }

  async openExternalLink(url: string) {
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
    let url = syllable.url || '';
    url = url
      .replace('static.upao.edu.pe/upload/silabo/', '')
      .replace('https://', '')
      .replace('http://', '');

    return (
      <Touchable onPress={this.onPress}>
        <View style={[styles.container]}>
          <Icon
            style={styles.icon}
            name={'file-pdf'}
            type={'MaterialCommunityIcons'}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{syllable.name}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {url}
            </Text>
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
  icon: {
    fontSize: 28,
    padding: 5,
    width: 50,
    color: '#e80019',
    textAlign: 'center'
  },
  info: {
    flex: 1,
    flexDirection: 'column'
  },
  name: {
    fontSize: 14,
    color: '#666'
  },
  subtitle: {
    fontSize: 12,
    color: '#999'
  }
});
