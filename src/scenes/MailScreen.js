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
    isLoading: false
  };

  reload = () => {
    this.setState({ isLoading: true }, () => {
      this.setState({ isLoading: false });
    });
  };

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
  }

  render() {
    let { isLoading } = this.state;

    if (isLoading) {
      return <Loading margin />;
    }

    let paddingTop = DimensionUtil.getNavigationBarHeight();
    return (
      <View style={{ paddingTop, flex: 1 }}>
        <WebView
          style={[styles.container]}
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
