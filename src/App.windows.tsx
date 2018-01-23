import * as React from 'react';
import Translator from './modules/i18n/Translator';
import en from './locales/en';
import pt from './locales/pt';
import Loading from './components/ui/Loading';
import Emitter from './modules/listener/Emitter';
import codePush from 'react-native-code-push';

console.disableYellowBox = true;
let codePushOptions = {
    installMode: codePush.InstallMode.IMMEDIATE,
    checkFrequency: codePush.CheckFrequency.ON_APP_START
};

class App extends React.Component {
    state = {
        isLoaded: false
    };

    onLocaleChange = () => {
        this.setState({isLoaded: true});
    };

    async componentDidMount() {
        Emitter.on('onLocaleChange', this.onLocaleChange);
        await Translator.init({
            defaultLocale: 'es',
            translations: {
                en,
                pt
            }
        });
    }

    componentWillMount() {
        Emitter.off(this.onLocaleChange);
    }

    render() {
        let {isLoaded} = this.state;
        if (!isLoaded) {
            return <Loading margin/>;
        }
        const Main = require('./Main').default;

        return <Main/>;
    }
}

export default (__DEV__ ? App : codePush(codePushOptions)(App));
