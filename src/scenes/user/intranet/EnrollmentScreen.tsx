import * as React from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Loading from '../../../components/ui/Loading';
import Log from '../../../modules/logger/Log';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import Config from '../../../scraping/Config';
import WebViewDownloader from '../../../components/ui/WebViewDownloader';

export interface EnrollmentScreenProps {
  period: string;
  level: string;
}

export interface State {
  html: string;
  isLoading: boolean;
  cacheLoaded: boolean;
}

const TAG = 'EnrollmentScreen';
export default class EnrollmentScreen extends React.Component<
  EnrollmentScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {
    html: '',
    isLoading: true,
    cacheLoaded: false
  };
  load = async () => {
    this.setState({ isLoading: true, cacheLoaded: false });
    await this.checkCache();
    await this.loadRequest();
  };
  getCacheKey = () => {
    let { level, period } = this.props;
    return `enrollment_detail_${period || '_'}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadRequest = async () => {
    let { cacheLoaded } = this.state;

    try {
      let { level, period } = this.props;
      let html = await UPAO.Student.Intranet.Enrollment.get(level, period);

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
      isLoading: false
    });
  };
  reload = () => {
    this.onRefresh();
  };
  onRefresh = () => {
    this.load();
  };

  // getParams(): any {
  //     let { params } = this.props.navigation.state || { params: {} };
  //     return params;
  // }

  componentWillUnmount() {
    UPAO.abort('Course.getGradesHTML');
  }

  componentDidMount() {
    // this.props.navigation.setParams({ reload: this.reload });
    this.load();
  }

  render() {
    let { html: content, isLoading } = this.state;

    let html = `
<html>
<head>
    <meta name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
	<title>app</title>
	<style>
* {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    font-size: 10px !important;
    font-family: Roboto,Helvetica,Arial,serif;
    border: none !important;
    width: auto !important;
    margin: 0 !important;
    padding:0 !important;
}

table tr:nth-child(1) > td {
    background: #0d61ac !important;
    color: #fff !important;
    padding: 7px 5px !important;
    border-right: 1px solid #0d61ac !important;
    border-bottom: 1px solid #0d61ac !important;
    font-weight: normal !important;
}


table {
    border-collapse: separate;
    border-spacing: 0;
    border-left: none;
    margin: 0 auto !important;
    border-left: 1px solid #f4f4f4 !important;
    border-top: 1px solid #0d61ac !important;
}

td {
    padding: 2px !important;
}

td {
    border-bottom: 1px solid #e6e6e6 !important;
    border-right: 1px solid #e6e6e6 !important;
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
