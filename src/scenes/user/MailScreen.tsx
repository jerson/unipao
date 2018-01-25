import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../../themes/styles';
import { _ } from '../../modules/i18n/Translator';
import NavigationButton from '../../components/ui/NavigationButton';
import Loading from '../../components/ui/Loading';
import * as PropTypes from 'prop-types';
import WebViewDownloader from '../../components/ui/WebViewDownloader';
import {
  NavigationNavigatorProps,
  NavigationScreenProp
} from 'react-navigation';

export interface MailScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  isLoading: boolean;
  isReloading: boolean;
}

export interface NavigationParams {
  params: {
    isLoading: boolean;
    reload: () => void;
  };
}

const TAG = 'MailScreen';
export default class MailScreen extends React.Component<
  MailScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationNavigatorProps<NavigationParams>) => ({
    title: _('Correo UPAO'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
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
            navigation && navigation.state.params.reload();
          }}
          icon={'refresh'}
          iconType={'MaterialIcons'}
        />
      </View>
    )
  });

  state: State = {
    isLoading: true,
    isReloading: false
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
    let { isReloading } = this.state;

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
              'User-Agent':
                'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.62 Mobile Safari/537.36'
            }
          }}
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
