import * as React from 'react';
import { NavState, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Color, Theme } from '../themes/styles';
import { _ } from '../modules/i18n/Translator';
import NavigationButton from '../components/ui/NavigationButton';
import Loading from '../components/ui/Loading';
import * as PropTypes from 'prop-types';
import Auth from '../modules/session/Auth';
import RouterUtil from '../modules/util/RouterUtil';
import RequestUtil from '../scraping/utils/RequestUtil';
import WebViewDownloader from '../components/ui/WebViewDownloader';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';
import UPAO from '../scraping/UPAO';

export interface LoginFallbackScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface State {
  isLoading: boolean;
  isReloading: boolean;
  html: string;
}

const TAG = 'LoginFallbackScreen';
export default class LoginFallbackScreen extends React.Component<
  LoginFallbackScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions = ({
    navigation,
    screenProps,
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: _('Iniciar sesión'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
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
            navigation && navigation.state.params!.reload();
          }}
          icon={'refresh'}
          iconType={'MaterialIcons'}
        />
      </View>
    ),
  });
  state: State = {
    html: '',
    isLoading: true,
    isReloading: false,
  };

  reload = () => {
    this.setState({ isReloading: true }, () => {
      this.setState({ isReloading: false, isLoading: true });
    });
    this.load();
  };
  onNavigationStateChange = async (navState: NavState) => {
    const url = navState.url || '';
    if (url.indexOf('upao.edu.pe/default.aspx') !== -1) {
      const success = await Auth.login();
      success && RouterUtil.resetTo(this.props.navigation, 'User');
    }
  };
  load = async () => {
    this.setState({ isLoading: true });

    try {
      const $ = await RequestUtil.fetch(
        '/login.aspx?ReturnUrl=%2fdefault.aspx',
        {},
        {
          tag: 'login',
          checkSession: false,
        }
      );
      //       $('iframe')
      //         .parent()
      //         .html('');
      //       $('a')
      //         .parent()
      //         .html('');
      //       $('body').append(`
      //        <script>
      //
      // var hash = Math.random();
      // var link = document.createElement( "link" );
      // link.href = "https://unipao.com/app.css?"+hash;
      // link.type = "text/css";
      // link.rel = "stylesheet";
      // link.media = "screen,print";
      // document.getElementsByTagName( "head" )[0].appendChild( link );
      //
      // </script>
      //
      // `);
      $('body').append(`
        <script>


try{
      var style = document.createElement( "style" );
      style.innerHTML = 'table, td, tr, div {' +
      '    width: auto !important;' +
      '    text-align: center !important;' +
      '    margin: 0 auto !important;' +
      '    background: none !important;' +
      '    font-family: Roboto,Helvetica,Arial; !important;' +
      '} ' +
      '#e_pie,.e_cab,map,div[style*=Orange], div[style*=orange] {' +
      '    display: none !important' +
      '} ' +
      'body{' +
      '    display: flex !important;' +
      '    align-items: center !important;' +
      '    justify-content: center !important;' +
      '    flex: 1 !important;' +
      '    height: 100vh !important;' +
      '    min-height: 100px !important;' +
      '    background: #fff !important;' +
      '}' +
      'input[type=text], input[type=password] {' +
      '    background: #fff !important;' +
      '    padding: 4px !important;' +
      '    border: 1px solid #d4d4d4 !important;' +
      '    border-radius: 4px !important;' +
      '    padding-left: 10px !important;' +
      '    font-size: 16px !important;' +
      '    font-weight: normal !important;' +
      '    max-width: 280px;' +
      '    -webkit-box-shadow: 0 0 10px rgba(0,0,0,0.08) !important;' +
      '    box-shadow: 0 0 10px rgba(0,0,0,0.08) !important;' +
      '    font-family: Roboto,Helvetica,Arial; !important;' +
      '} '+
      'img {' +
      '  width: 100% !important;' +
      '}';
      document.getElementsByTagName( "head" )[0].appendChild( style );


      var element = document.getElementsByTagName("iframe"), index;
      for (index = element.length - 1; index >= 0; index--) {
         element[index].parentNode.parentNode.removeChild(element[index].parentNode);
      }


      var element3 = document.getElementsByTagName("a"), index3;
      for (index3 = element3.length - 1; index3 >= 0; index3--) {
        element3[index3].parentNode.removeChild(element3[index3]);
      }



      var hash = Math.random();
      var link = document.createElement( "link" );
      link.href = "https://unipao.com/app.css?"+hash;
      link.type = "text/css";
      link.rel = "stylesheet";
      link.media = "screen,print";
      document.getElementsByTagName( "head" )[0].appendChild( link );

      var metaTag=document.createElement('meta');
      metaTag.name = "viewport";
      metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0";
      document.getElementsByTagName('head')[0].appendChild(metaTag);

}catch(e){
}

</script>`);

      this.setState({
        isLoading: false,
        isReloading: false,
        html: $('html').html(),
      });
    } catch (e) {
      this.setState({ isLoading: false, isReloading: false });
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    this.load();
  }

  componentWillUnmount() {
    RequestUtil.abort('login');
  }

  render() {
    const { isReloading, html } = this.state;

    if (isReloading) {
      return <Loading margin />;
    }

    return (
      <View style={styles.container}>
        <WebViewDownloader
          style={[styles.container]}
          onNavigationStateChange={this.onNavigationStateChange}
          scalesPageToFit={true}
          onLoadStart={() => {
            this.setState({ isLoading: true });
            this.props.navigation.setParams({ isLoading: true });
          }}
          onLoadEnd={() => {
            this.setState({ isLoading: false });
            this.props.navigation.setParams({ isLoading: false });
          }}
          source={{
            // html,
            // baseUrl: 'https://campusvirtual.upao.edu.pe/',
            uri:
              'https://campusvirtual.upao.edu.pe/login.aspx?ReturnUrl=%2fdefault.aspx',
            // uri:'https://requestb.in/1adqj3o1',
            headers: {
              'X-Requested-With': '',
              'X-Request-Id': '',
              // Accept:
              //   'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
              // Connection: 'keep-alive',
              // Pragma: 'no-cache',
              // 'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8,pt;q=0.7',
              // 'Cache-Control': 'no-cache',
              // 'Upgrade-Insecure-Requests': '1',
              Referer:
                'https://campusvirtual.upao.edu.pe/login.aspx?ReturnUrl=%2fdefault.aspx',
              'User-Agent': UPAO.getUserAgentDesktop(),
            },
          }}
        />

        <StatusBar
          backgroundColor="#0d61ac"
          translucent
          animated
          barStyle="dark-content"
        />
        <NavigationButton
          onPress={() => {
            this.props.navigation.goBack();
          }}
          subMenu
          style={{ top: Platform.OS === 'ios' ? 20 : 5 }}
          icon={'arrow-back'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
