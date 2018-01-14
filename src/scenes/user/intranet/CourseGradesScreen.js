import React from 'react';
import { StyleSheet, View, WebView } from 'react-native';
import { Theme } from '../../../themes/styles';
import { _ } from '../../../modules/i18n/Translator';
import DimensionUtil from '../../../modules/util/DimensionUtil';
import NavigationButton from '../../../components/ui/NavigationButton';
import Loading from '../../../components/ui/Loading';
import PropTypes from 'prop-types';
import Config from '../../../scraping/Config';
import UPAO from '../../../scraping/UPAO';

const TAG = 'CourseGradesScreen';
export default class CourseGradesScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerBackTitle: null,
    title: _('Notas del curso'),
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
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
    html: '',
    isLoading: true,
    isReloading: false
  };

  load = async () => {
    this.setState({ isLoading: true });

    try {
      let { course } = this.getParams();
      let html = await UPAO.Student.Intranet.Course.getGradesHTML(course);
      this.setState({ isLoading: false, isReloading: false, html });
    } catch (e) {
      console.log(e);
      this.setState({ isLoading: false, isReloading: false });
    }
  };
  reload = () => {
    this.onRefresh();
  };
  onRefresh = () => {
    this.load();
  };

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    this.load();
  }

  render() {
    let paddingTop = DimensionUtil.getNavigationBarHeight();
    let { html, isLoading } = this.state;

    return (
      <View style={[styles.container, { paddingTop }]}>
        {isLoading && <Loading margin />}
        {!isLoading && (
          <WebView
            style={[styles.container]}
            javaScriptEnabled
            domStorageEnabled
            scalesPageToFit={true}
            source={{
              html,
              baseUrl: Config.URL
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
