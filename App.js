import React from 'react';
import Translator from './src/modules/i18n/Translator';
import en from './src/locales/en';
import pt from './src/locales/pt';
import Loading from './src/components/ui/Loading';
import Emitter from './src/modules/listener/Emitter';
import codePush from 'react-native-code-push';
import Push from 'appcenter-push';

console.disableYellowBox = true;
let codePushOptions = {
    installMode: codePush.InstallMode.ON_NEXT_RESUME,
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};

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
                en, pt
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


Push.setListener({
    onPushNotificationReceived: function (pushNotification) {
        let message = pushNotification.message;
        let title = pushNotification.title;

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
    }
});
export default codePush(codePushOptions)(App);
