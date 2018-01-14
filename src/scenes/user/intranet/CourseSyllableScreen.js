import React from 'react';
import { Platform, StyleSheet, View, WebView } from 'react-native';
import { Theme } from '../../../themes/styles';
import { _ } from '../../../modules/i18n/Translator';
import DimensionUtil from '../../../modules/util/DimensionUtil';
import NavigationButton from '../../../components/ui/NavigationButton';
import Loading from '../../../components/ui/Loading';
import PropTypes from 'prop-types';
import Auth from '../../../modules/session/Auth';
import RouterUtil from '../../../modules/util/RouterUtil';
import StatusBarView from '../../../components/ui/StatusBarView';
import cio from 'cheerio-without-node-native';
import RequestUtil from '../../../scraping/utils/RequestUtil';
import ParamsUtils from '../../../scraping/utils/ParamsUtils';
import Config from '../../../scraping/Config';

const TAG = 'CourseSyllableScreen';
export default class CourseSyllableScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerBackTitle: null,
    title: _('Silabo del curso'),
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
    let { course } = this.getParams();

    try {
      let params = {
        f: 'YAAHIST',
        a: 'SHOW_SILABO',
        valor: course.code,
        codigo: course.id
      };

      console.log(params);
      let $ = await RequestUtil.fetch('/controlador/cargador.aspx', {
        method: 'POST',
        body: ParamsUtils.getFormData(params)
      });

      let html = $.html();
      console.log(html);
      this.setState({ isLoading: false, isReloading: false, html });
    } catch (e) {
      console.log(e);
      this.setState({ isLoading: false, isReloading: false });
    }
  };

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
  }
  reload = () => {
    this.onRefresh();
  };
  onRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.load();
    });
  };
  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    this.load();
  }

  render() {
    let paddingTop = DimensionUtil.getNavigationBarHeight();
    let { html, isRefreshing, isLoading } = this.state;

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
