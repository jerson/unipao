import * as React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {Theme} from '../themes/styles';
import {_} from '../modules/i18n/Translator';
import NavigationButton from '../components/ui/NavigationButton';
import Loading from '../components/ui/Loading';
import * as PropTypes from 'prop-types';
import Auth from '../modules/session/Auth';
import RouterUtil from '../modules/util/RouterUtil';
import RequestUtil from '../scraping/utils/RequestUtil';
import WebViewDownloader from '../components/ui/WebViewDownloader';

const TAG = 'LoginFallbackScreen';
export default class LoginFallbackScreen extends React.Component {
    static contextTypes = {
        notification: PropTypes.object.isRequired
    };
    static navigationOptions = ({navigation, screenProps}) => ({
        title: _('Iniciar sesión'),
        headerBackTitle: null,
        headerTitleStyle: [Theme.title, Theme.subtitle],
        headerTintColor: Theme.tintColor,
        headerStyle: [
            Theme.navigationBar,
            Theme.subNavigationBar,
            Theme.shadowDefault
        ],
        headerRight: (
            <View style={{flexDirection: 'row'}}>
                {navigation &&
                navigation.state &&
                navigation.state.params &&
                navigation.state.params.isLoading && (
                    <View style={{margin: 15}}>
                        <Loading/>
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
        html: '',
        isLoading: true,
        isReloading: false
    };

    reload = () => {
        this.setState({isReloading: true}, () => {
            this.setState({isReloading: false, isLoading: true});
        });
        // this.load();
    };
    onNavigationStateChange = async navState => {
        let url = navState.url;
        if (url.indexOf('upao.edu.pe/default.aspx') !== -1) {
            let success = await Auth.login();
            success && RouterUtil.resetTo(this.props.navigation, 'User');
        }
    };
    load = async () => {
        this.setState({isLoading: true});

        try {
            let $ = await RequestUtil.fetch('/login.aspx?ReturnUrl=%2fdefault.aspx', {
                tag: 'login',
                checkSession: false
            });
            $('iframe')
                .parent()
                .html('');
            $('a')
                .parent()
                .html('');
            $('body').append(`
       <script>
    
var hash = Math.random();
var link = document.createElement( "link" );
link.href = "https://uploader.setbeat.com/test.css?"+hash;
link.type = "text/css";
link.rel = "stylesheet";
link.media = "screen,print";
document.getElementsByTagName( "head" )[0].appendChild( link );

</script>

`);

            this.setState({isLoading: false, isReloading: false, html: $.html()});
        } catch (e) {
            this.setState({isLoading: false, isReloading: false});
        }
    };

    componentDidMount() {
        this.props.navigation.setParams({reload: this.reload});
        // this.load();
    }

    componentWillUnmount() {
        RequestUtil.abort('login');
    }

    render() {
        let {isReloading} = this.state;

        if (isReloading) {
            return <Loading margin/>;
        }

        return (
            <View style={styles.container}>
                <WebViewDownloader
                    style={[styles.container]}
                    onNavigationStateChange={this.onNavigationStateChange}
                    scalesPageToFit={true}
                    onLoadStart={() => {
                        this.setState({isLoading: true});
                        this.props.navigation.setParams({isLoading: true});
                    }}
                    onLoadEnd={() => {
                        this.setState({isLoading: false});
                        this.props.navigation.setParams({isLoading: false});
                    }}
                    source={{
                        uri:
                            'https://campusvirtual.upao.edu.pe/login.aspx?ReturnUrl=%2fdefault.aspx'
                    }}
                />

                <StatusBar
                    backgroundColor='#0d61ac'
                    translucent
                    animated
                    barStyle='dark-content'
                />
                <NavigationButton
                    onPress={() => {
                        this.props.navigation.goBack();
                    }}
                    subMenu
                    style={{top: Platform.OS === 'ios' ? 20 : 5}}
                    icon={'arrow-back'}
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
