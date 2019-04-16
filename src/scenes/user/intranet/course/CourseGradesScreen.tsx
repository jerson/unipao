import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Color, Theme } from '../../../../themes/styles';
import { _ } from '../../../../modules/i18n/Translator';
import NavigationButton from '../../../../components/ui/NavigationButton';
import Loading from '../../../../components/ui/Loading';
import * as PropTypes from 'prop-types';
import Config from '../../../../scraping/Config';
import UPAO from '../../../../scraping/UPAO';
import Log from '../../../../modules/logger/Log';
import CacheStorage from '../../../../modules/storage/CacheStorage';
import WebViewDownloader from '../../../../components/ui/WebViewDownloader';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';

export interface CourseGradesScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface State {
  html: string;
  isLoading: boolean;
  cacheLoaded: boolean;
}

const TAG = 'CourseGradesScreen';
export default class CourseGradesScreen extends React.Component<
  CourseGradesScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions = ({
    navigation,
    screenProps,
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    headerBackTitle: null,
    title: _('Notas del curso'),
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
    ],
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <NavigationButton
          onPress={() => {
            navigation.state.params!.reload();
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
    cacheLoaded: false,
  };

  load = async () => {
    this.setState({ isLoading: true, cacheLoaded: false });
    await this.checkCache();
    await this.loadRequest();
  };
  getCacheKey = () => {
    const { course } = this.getParams();
    return `grades_${course.id || '_'}`;
  };
  checkCache = async () => {
    try {
      const data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadRequest = async () => {
    const { cacheLoaded } = this.state;

    try {
      const { course } = this.getParams();
      const html = await UPAO.Student.Intranet.Course.getGradesHTML(course);

      this.loadResponse(html);
      CacheStorage.set(this.getCacheKey(), html);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse('');
      } else {
        this.setState({ isLoading: false });
      }
    }
  };
  loadResponse = (html: string, cacheLoaded = false) => {
    this.setState({
      cacheLoaded,
      html,
      isLoading: false,
    });
  };
  reload = () => {
    this.onRefresh();
  };
  onRefresh = () => {
    this.load();
  };

  getParams(): any {
    const { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentWillUnmount() {
    UPAO.abort('Course.getGradesHTML');
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    this.load();
  }

  render() {
    const { html: content, isLoading } = this.state;
    const html = `
<html>
<head>
    <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
	<title>app</title>
	<style>
* {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    font-size: 12px !important;
    font-family: Roboto,Helvetica,Arial,serif;
    border: none !important;
    width: auto !important;
    margin: 0 !important;
}

table tr:nth-child(1) > td {
    background: #f59331 !important;
    color: #fff !important;
    padding: 12px 5px;
    border-right: 1px solid #ea8a29 !important;
    border-bottom: 1px solid #ea8a29 !important;
    font-weight: normal !important;
}

table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100% !important;
    border-left: none;
    min-height: 100% !important;
}

td {
    padding: 5px;
}

td {
    border-bottom: 1px solid #e6e6e6 !important;
    border-right: 1px solid #e6e6e6 !important;
}


table  tr > td:last-child,table  tr > td:last-child b {
    text-align: center;
    font-size: 17px !important;
    border-right: none;
}
table  tr > td:last-child b,
table  tr:last-child > td:last-child  {
    color:#0d61ac !important;
    font-weight: bold;
}

table  tr > td:first-child {
    color:#555;
    font-size: 11px !important;
}

body,html{
    margin:0 !important;
    padding: 0 !important;
    overflow: auto !important;
}
</style>
</head>
<body>
${content}
</body>
</html>
    `;

    return (
      <View style={[styles.container]}>
        {isLoading && <Loading margin />}
        {!isLoading && (
          <WebViewDownloader
            style={[styles.container]}
            source={{
              html,
              baseUrl: Config.URL,
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
