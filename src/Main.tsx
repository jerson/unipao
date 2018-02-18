import * as React from 'react';
import { StatusBar, View } from 'react-native';
import Request from './modules/network/Request';
import Config from './Config';
import MainRouter from './routers/MainRouter';
import * as PropTypes from 'prop-types';
import MessageCenter from './components/ui/MessageCenter';
import Auth from './modules/session/Auth';
import 'moment/locale/es';
import Emitter from './modules/listener/Emitter';
import RouterUtil from './modules/util/RouterUtil';
import { _ } from './modules/i18n/Translator';
import SingleStorage from './modules/storage/SingleStorage';
import CacheStorage from './modules/storage/CacheStorage';
import DimensionUtil from './modules/util/DimensionUtil';
import { NavigationScreenProp } from 'react-navigation';
import { Message } from './components/ui/MessageItem';

const numeral = require('numeral');

numeral.defaultFormat('0,0.00');

export interface MainProps {}

export interface State {}

export default class Main extends React.Component<MainProps, State> {
  static childContextTypes = {
    notification: PropTypes.object
  };
  refs: any;
  onForceLogout = async () => {
    if (this.forcedLogout) {
      return;
    }
    this.forcedLogout = true;
    this.refs.notification.show({
      type: 'warning',
      title: _(
        'Sessión terminada, tal vez has iniciado sesión otro dispositivo/navegador o pasaste un tiempo inactivo'
      ),
      icon: 'error-outline',
      autoDismiss: 8,
      iconType: 'MaterialIcons'
    });

    await Auth.logout();
    RouterUtil.resetTo(this.refs.navigation, 'Login');
    setTimeout(() => {
      this.forcedLogout = false;
    }, 1000);
  };
  private forcedLogout = false;

  getChildContext() {
    return {
      notification: {
        show: (params: Message) => {
          this.refs.notification && this.refs.notification.show(params);
        }
      }
    };
  }

  componentWillMount() {
    Request.init({
      baseUrl: Config.url.server
    });
    Emitter.off(this.onForceLogout);
  }

  componentDidMount() {
    Auth.init({
      authPath: 'user/me',
      hashToken: Config.token.app
    });
    CacheStorage.init({
      path: 'cache.db',
      schemaVersion: 1
    });
    Emitter.on('onForceLogout', this.onForceLogout);
    this.showIntro();
  }

  async showIntro() {
    let val = '104';
    let intro = await SingleStorage.get('intro');
    if (intro !== val) {
      RouterUtil.resetTo(this.refs.navigation, 'Intro');
      SingleStorage.set('intro', val);
    }
  }

  render() {
    let paddingTop = DimensionUtil.getStatusBarPadding();
    return (
      <View style={{ paddingTop, flex: 1 }}>
        <StatusBar
          backgroundColor="#0d61ac"
          translucent
          animated
          barStyle="light-content"
        />
        <MainRouter ref={'navigation'} />
        <MessageCenter ref={'notification'} />
      </View>
    );
  }
}
