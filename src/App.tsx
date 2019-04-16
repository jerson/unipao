import * as React from 'react';
import Translator from './modules/i18n/Translator';
import en from './locales/en';
import pt from './locales/pt';
import Loading from './components/ui/Loading';
import Emitter from './modules/listener/Emitter';
import codePush from 'react-native-code-push';
import * as Push from 'appcenter-push';

console.disableYellowBox = true;
const codePushOptions = {
  installMode: codePush.InstallMode.ON_NEXT_RESUME,
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

export interface AppProps {}

export interface State {
  isLoaded: boolean;
}

class App extends React.Component<AppProps, State> {
  state: State = {
    isLoaded: false,
  };

  onLocaleChange = () => {
    this.setState({ isLoaded: true });
  };

  async componentDidMount() {
    Emitter.on('onLocaleChange', this.onLocaleChange);
    await Translator.init({
      defaultLocale: 'es',
      translations: {
        en,
        pt,
      },
    });
  }

  componentWillMount() {
    Emitter.off(this.onLocaleChange);
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <Loading style={{ margin: 50 }} />;
    }
    const Main = require('./Main').default;

    return <Main />;
  }
}

Push.setListener({
  onPushNotificationReceived(pushNotification: any) {
    const message = pushNotification.message;
    const title = pushNotification.title;

    // if (message === null || message === undefined) {
    //     // Android messages received in the background don't include a message. On Android, that fact can be used to
    //     // check if the message was received in the background or foreground. For iOS the message is always present.
    //     title = "Android background";
    //     message = "<empty>";
    // }
    //
    // // Custom name/value pairs set in the App Center web portal are in customProperties
    // if (pushNotification.customProperties && Object.keys(pushNotification.customProperties).length > 0) {
    //     message += '\nCustom properties:\n' + JSON.stringify(pushNotification.customProperties);
    // }
    //
    // if (AppState.currentState === 'active') {
    //     Alert.alert(title, message);
    // }
    // else {
    //     // Sometimes the push callback is received shortly before the app is fully active in the foreground.
    //     // In this case you'll want to save off the notification info and wait until the app is fully shown
    //     // in the foreground before displaying any UI. You could use AppState.addEventListener to be notified
    //     // when the app is fully in the foreground.
    // }
  },
});
export default (__DEV__ ? App : codePush(codePushOptions)(App));
