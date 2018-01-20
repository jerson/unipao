import React from 'react';
import { Clipboard, Linking, StyleSheet, WebView } from 'react-native';
import Log from '../../modules/logger/Log';
import { _ } from '../../modules/i18n/Translator';
import PropTypes from 'prop-types';

const TAG = 'WebViewDownloader';
export default class WebViewDownloader extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  onNavigationStateChange = navState => {
    let url = navState.url;
    if (url.indexOf('http') !== 0) {
      return;
    }
    let lastPart = url.substr(url.lastIndexOf('.') + 1);

    Log.warn(TAG, 'onNavigationStateChange', url);

    let { onNavigationStateChange } = this.props;
    if (typeof onNavigationStateChange === 'function') {
      onNavigationStateChange(navState);
    }

    if (url.indexOf('adjunto.aspx?cod=') !== -1) {
      this.openRemoteLink(url);
      return;
    }

    switch (lastPart) {
      case 'ipa':
      case 'apk':
      case 'plist':
      case 'zip':
      case 'rar':
      case 'doc':
      case 'docx':
      case 'ppt':
      case 'pptx':
      case 'xls':
      case 'xlsx':
      case 'pdf':
      case '7zip':
        this.openRemoteLink(url);
        break;
    }
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
        this.context.notification &&
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
    let { onNavigationStateChange, ...props } = this.props;

    return (
      <WebView
        style={[styles.container]}
        javaScriptEnabled
        domStorageEnabled
        javaScriptEnabledAndroid
        scalesPageToFit={false}
        onNavigationStateChange={this.onNavigationStateChange}
        {...props}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
