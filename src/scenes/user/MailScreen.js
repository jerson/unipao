import React from 'react';
import { Clipboard, Linking, StyleSheet, View, WebView } from 'react-native';
import { Theme } from '../../themes/styles';
import { _ } from '../../modules/i18n/Translator';
import DimensionUtil from '../../modules/util/DimensionUtil';
import NavigationButton from '../../components/ui/NavigationButton';
import Loading from '../../components/ui/Loading';
import Log from '../../modules/logger/Log';
import PropTypes from 'prop-types';

const TAG = 'MailScreen';
export default class MailScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: _('Correo UPAO'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ],
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        {navigation &&
          navigation.state &&
          navigation.state.params &&
          navigation.state.params.isLoading && (
            <View style={{ margin: 15 }}>
              <Loading />
            </View>
          )}
        <NavigationButton
          onPress={() => {
            navigation.state.params.reload();
          }}
          icon={'refresh'}
          iconType={'MaterialIcons'}
        />
      </View>
    )
  });

  state = {
    isLoading: true,
    isReloading: false
  };

  reload = () => {
    this.setState({ isReloading: true }, () => {
      this.setState({ isReloading: false, isLoading: true });
    });
  };
  onNavigationStateChange = navState => {
    let url = navState.url;
    let lastPart = url.substr(url.lastIndexOf('.') + 1);

    Log.info(TAG, url);
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

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
  }

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
        this.context.notification.add({
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
    let { isLoading, isReloading } = this.state;

    if (isReloading) {
      return <Loading margin />;
    }

    let paddingTop = DimensionUtil.getNavigationBarHeight();
    return (
      <View style={{ paddingTop, flex: 1 }}>
        <WebView
          style={[styles.container]}
          onNavigationStateChange={this.onNavigationStateChange}
          onLoadStart={() => {
            this.setState({ isLoading: true });
            this.props.navigation.setParams({ isLoading: true });
          }}
          onLoadEnd={() => {
            this.setState({ isLoading: false });
            this.props.navigation.setParams({ isLoading: false });
          }}
          source={{
            uri: 'https://mail.google.com/a/upao.edu.pe',
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Mobile Safari/537.36'
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
