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
import WebViewDownloader from '../components/ui/WebViewDownloader';

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
    
var hash = Math.random();
var link = document.createElement( "link" );
link.href = "https://uploader.setbeat.com/test.css?"+hash;
link.type = "text/css";
link.rel = "stylesheet";
link.media = "screen,print";
document.getElementsByTagName( "head" )[0].appendChild( link );

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
    let { isReloading } = this.state;

    if (isReloading) {
      return <Loading margin />;
    }

    const script = `


try{
        
    var style = document.createElement( "style" );
    style.innerHTML = 'table, td, tr, div {' +
    '    width: auto !important;\\n' +
    '    text-align: center !important;\\n' +
    '    margin: 0 auto !important;\\n' +
    '    background: none !important;\\n' +
    '    font-family: Roboto,Helvetica,Arial; !important;\\n' +
    '} ' +
    '#e_pie,.e_cab,map,div[style*=Orange], div[style*=orange] {' +
    '    display: none !important\\n' +
    '} ' +
    'body{' +
    '    display: flex !important;\\n' +
    '    align-items: center !important;\\n' +
    '    justify-content: center !important;\\n' +
    '    flex: 1 !important;\\n' +
    '    height: 100vh !important;\\n' +
    '    min-height: 100px !important;\\n' +
    '    background: #fff !important;\\n' +
    '}' +
    'input[type=text], input[type=password] {' +
    '    background: #fff !important;\\n' +
    '    padding: 4px !important;\\n' +
    '    border: 1px solid #d4d4d4 !important;\\n' +
    '    border-radius: 4px !important;\\n' +
    '    padding-left: 10px !important;\\n' +
    '    font-size: 16px !important;\\n' +
    '    font-weight: normal !important;\\n' +
    '    max-width: 280px;\\n' +
    '    -webkit-box-shadow: 0 0 10px rgba(0,0,0,0.08) !important;\\n' +
    '    font-family: Roboto,Helvetica,Arial; !important;\\n' +
    '} '+
    'img {' +
    '  width: 100% !important;\\n' +
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
    
}catch(e){
}



`;

    const scriptIOS = `
   
    var metaTag=document.createElement('meta');
    metaTag.name = "viewport"
    metaTag.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    document.getElementsByTagName('head')[0].appendChild(metaTag);
    `;
    return (
      <View style={styles.container}>
        <WebViewDownloader
          style={[styles.container]}
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
