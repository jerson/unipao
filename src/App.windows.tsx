import * as React from 'react';
import Translator from './modules/i18n/Translator';
import en from './locales/en';
import pt from './locales/pt';
import Loading from './components/ui/Loading';
import Emitter from './modules/listener/Emitter';
import codePush from 'react-native-code-push';

console.disableYellowBox = true;
const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
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
    if (!__DEV__) {
      codePush.sync({
        installMode: codePush.InstallMode.IMMEDIATE,
      });
    }
  }

  componentWillMount() {
    Emitter.off(this.onLocaleChange);
  }

  render() {
    const { isLoaded } = this.state;
    if (!isLoaded) {
      return <Loading margin />;
    }
    const Main = require('./Main').default;

    return <Main />;
  }
}

export default (__DEV__ ? App : codePush(codePushOptions)(App));
