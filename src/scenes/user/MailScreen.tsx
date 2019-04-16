import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Color, Theme } from '../../themes/styles';
import { _ } from '../../modules/i18n/Translator';
import NavigationButton from '../../components/ui/NavigationButton';
import Loading from '../../components/ui/Loading';
import * as PropTypes from 'prop-types';
import WebViewDownloader from '../../components/ui/WebViewDownloader';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';
import UPAO from '../../scraping/UPAO';

export interface MailScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface State {
  isLoading: boolean;
  isReloading: boolean;
}

const TAG = 'MailScreen';
export default class MailScreen extends React.Component<
  MailScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions = ({
    navigation,
    screenProps,
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: _('Correo UPAO'),
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
    isLoading: true,
    isReloading: false,
  };

  reload = () => {
    this.setState({ isReloading: true }, () => {
      this.setState({ isReloading: false, isLoading: true });
    });
  };

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
  }

  render() {
    const { isReloading } = this.state;

    if (isReloading) {
      return <Loading margin />;
    }

    return (
      <View style={[styles.container]}>
        <WebViewDownloader
          style={[styles.container]}
          onLoadStart={() => {
            this.setState({ isLoading: true });
            this.props.navigation.setParams({ isLoading: true });
          }}
          onLoadEnd={() => {
            this.setState({ isLoading: false });
            this.props.navigation.setParams({ isLoading: false });
          }}
          source={{
            uri: 'https://mail.google.com/a/upao.edu.pe',
            headers: {
              'X-Requested-With': '',
              'X-Request-Id': '',
              Referer: 'https://campusvirtual.upao.edu.pe/',
              'User-Agent': UPAO.getUserAgentMobile(),
            },
          }}
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
