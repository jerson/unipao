import React from 'react';
import { StyleSheet, View, WebView } from 'react-native';
import { Theme } from '../themes/styles';
import { _ } from '../modules/i18n/Translator';
import DimensionUtil from '../modules/util/DimensionUtil';
import NavigationButton from '../components/ui/NavigationButton';
import Loading from '../components/ui/Loading';

export default class MailScreen extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
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
  componentDidUpdate(prevProps, prevState) {}

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
  }

  render() {
    let { isLoading, isReloading } = this.state;

    if (isReloading) {
      return <Loading margin />;
    }

    let paddingTop = DimensionUtil.getNavigationBarHeight();
    return (
      <View style={{ paddingTop, flex: 1 }}>
        <WebView
          style={[styles.container]}
          onLoadStart={() => {
            this.setState({ isLoading: true });
            this.props.navigation.setParams({ isLoading: true });
          }}
          onLoadEnd={() => {
            this.setState({ isLoading: false });
            this.props.navigation.setParams({ isLoading: false });
          }}
          source={{ uri: 'https://mail.google.com/a/upao.edu.pe' }}
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
