import React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import Request from './modules/network/Request';
import Config from '../Config';
import MainRouter from './routers/MainRouter';
import PropTypes from 'prop-types';
import MessageCenter from './components/ui/MessageCenter';
import Auth from './modules/session/Auth';
import 'moment/locale/es';
import StatusBarView from './components/ui/StatusBarView';
import numeral from 'numeral';
import Emitter from './modules/listener/Emitter';
import RouterUtil from './modules/util/RouterUtil';
import { _ } from './modules/i18n/Translator';
import SingleStorage from './modules/storage/SingleStorage';

numeral.defaultFormat('0,0.00');

export default class Main extends React.Component {
  static childContextTypes = {
    notification: PropTypes.object
  };
  forcedLogout = false;
  onForceLogout = async () => {
    if (this.forcedLogout) {
      return;
    }
    this.forcedLogout = true;
    this.noti.show({
      type: 'warning',
      title: _(
        'Sessión cerrada, no puedes conectarte en dos dispositivos a la vez'
      ),
      icon: 'error-outline',
      autoDismiss: 4,
      iconType: 'MaterialIcons'
    });

    await Auth.logout();
    this.forcedLogout = false;
    RouterUtil.resetTo(this.refs.navigation, 'Login');
  };

  getChildContext() {
    return {
      notification: {
        show: (params: any) => {
          this.noti && this.noti.show(params);
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
    Emitter.on('onForceLogout', this.onForceLogout);
    this.showIntro();
  }

  async showIntro() {
    let val = '6';
    let intro = await SingleStorage.get('intro');
    if (intro !== val) {
      RouterUtil.resetTo(this.refs.navigation, 'Intro');
      SingleStorage.set('intro', val);
    }
  }

  render() {
    let paddingTop = Platform.OS === 'ios' ? 0 : 20;
    return (
      <View style={{ paddingTop, flex: 1 }}>
        <StatusBar
          backgroundColor="#0d61ac"
          translucent
          animated
          barStyle="light-content"
        />
        <StatusBarView />
        <MainRouter ref={'navigation'} />
        <MessageCenter
          ref={ref => {
            this.noti = ref;
          }}
        />
      </View>
    );
  }
}
