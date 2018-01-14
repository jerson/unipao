import React from 'react';
import { Platform, StyleSheet, View, WebView } from 'react-native';
import { Theme } from '../themes/styles';
import { _ } from '../modules/i18n/Translator';
import DimensionUtil from '../modules/util/DimensionUtil';
import NavigationButton from '../components/ui/NavigationButton';
import Loading from '../components/ui/Loading';
import PropTypes from 'prop-types';
import Auth from '../modules/session/Auth';
import RouterUtil from '../modules/util/RouterUtil';
import StatusBarView from '../components/ui/StatusBarView';
import RequestUtil from '../scraping/utils/RequestUtil';

const TAG = 'LoginFallbackScreen';
export default class LoginFallbackScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: _('Iniciar sesión'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
      { top: 0 }
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
    html: '',
    isLoading: true,
    isReloading: false
  };

  reload = () => {
    this.setState({ isReloading: true }, () => {
      this.setState({ isReloading: false, isLoading: true });
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
    this.setState({ isLoading: true });

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
    
// var hash = Math.random();
// var link = document.createElement( "link" );
// link.href = "https://uploader.setbeat.com/test.css?"+hash;
// link.type = "text/css";
// link.rel = "stylesheet";
// link.media = "screen,print";
// document.getElementsByTagName( "head" )[0].appendChild( link );

</script>

`);

      this.setState({ isLoading: false, isReloading: false, html: $.html() });
    } catch (e) {
      this.setState({ isLoading: false, isReloading: false });
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    // this.load();
  }

  componentWillUnmount() {
    RequestUtil.abort('login');
  }

  render() {
    let { isLoading, isReloading } = this.state;

    if (isReloading) {
      return <Loading margin />;
    }

    let paddingTop = DimensionUtil.getNavigationBarHeight();
    const script = `


try{
    var element = document.getElementsByTagName("iframe"), index;
    
    for (index = element.length - 1; index >= 0; index--) {
       element[index].parentNode.parentNode.removeChild(element[index].parentNode); 
    }
    
    var element2 = document.getElementsByTagName("a"), index;
    for (index = element2.length - 1; index >= 0; index--) {
      element2[index].parentNode.parentNode.removeChild(element2[index].parentNode);
    }
}catch(e){
}



`;

    const scriptIOS = `
var metaTag=document.createElement('meta');
metaTag.name = "viewport"
metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=1"
document.getElementsByTagName('head')[0].appendChild(metaTag);`;
    return (
      <View style={{ flex: 1 }}>
        <WebView
          style={[styles.container]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          javaScriptEnabledAndroid
          injectedJavaScript={script + (Platform.OS === 'ios' ? scriptIOS : '')}
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
            uri:
              'https://campusvirtual.upao.edu.pe/login.aspx?ReturnUrl=%2fdefault.aspx'
          }}
        />

        <StatusBarView style={{ backgroundColor: '#0d61ac' }} />
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
    flex: 1
  }
});
