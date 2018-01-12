import React from 'react';
import { StyleSheet, Platform, View, WebView } from 'react-native';
import { Theme } from '../themes/styles';
import { _ } from '../modules/i18n/Translator';
import DimensionUtil from '../modules/util/DimensionUtil';
import NavigationButton from '../components/ui/NavigationButton';
import Loading from '../components/ui/Loading';
import PropTypes from 'prop-types';
import Auth from '../modules/session/Auth';
import Log from '../modules/logger/Log';
import RouterUtil from '../modules/util/RouterUtil';

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
    isLoading: true,
    isReloading: false
  };

  reload = () => {
    this.setState({ isReloading: true }, () => {
      this.setState({ isReloading: false, isLoading: true });
    });
  };
  onNavigationStateChange = async navState => {
    let url = navState.url;
    Log.info(TAG, url);
    if (url.indexOf('upao.edu.pe/default.aspx') !== -1) {
      let success = await Auth.login();
      success && RouterUtil.resetTo(this.props.navigation, 'User');
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
  }

  render() {
    let { isLoading, isReloading } = this.state;

    if (isReloading) {
      return <Loading margin />;
    }

    let paddingTop = DimensionUtil.getNavigationBarHeight();
    let hash = Math.random();
    const script = `

var link = document.createElement( "link" );
link.href = "http://movies.jerson.me/demo.css?${hash}";
link.type = "text/css";
link.rel = "stylesheet";
link.media = "screen,print";

document.getElementsByTagName( "head" )[0].appendChild( link );
`;

    return (
      <View style={{ flex: 1 }}>
        <WebView
          style={[styles.container]}
          injectedJavaScript={script}
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
        <NavigationButton
          onPress={() => {
            this.props.navigation.goBack();
          }}
          subMenu
          style={{ top: Platform.OS==='ios' ? 20 : 5 }}
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
