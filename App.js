import React from 'react';
import Translator from './src/modules/i18n/Translator';
import en from './src/locales/en';
import Loading from './src/components/ui/Loading';
import Emitter from './src/modules/listener/Emitter';
import codePush from "react-native-code-push";

console.disableYellowBox = true;
let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

class App extends React.Component {

    state = {
        isLoaded: false,
    };

    onLocaleChange = () => {
        this.setState({isLoaded: true})
    };

    async componentDidMount() {
        Emitter.on('onLocaleChange', this.onLocaleChange);
        await Translator.init({
            defaultLocale: 'es',
            translations: {
                en
            }
        });
    }

    componentWillMount() {
        Emitter.off(this.onLocaleChange);
    }

    render() {

        let {isLoaded} = this.state;
        if (!isLoaded) {
            return <Loading margin/>
        }
        const Main = require('./src/Main').default;

        return (
            <Main/>
        );
    }
}

export default codePush(codePushOptions)(App);
