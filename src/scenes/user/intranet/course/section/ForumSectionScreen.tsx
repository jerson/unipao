import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import CacheStorage from '../../../../../modules/storage/CacheStorage';
import Log from '../../../../../modules/logger/Log';
import UPAO from '../../../../../scraping/UPAO';
import Loading from '../../../../../components/ui/Loading';
import Config from '../../../../../scraping/Config';
import WebViewDownloader from '../../../../../components/ui/WebViewDownloader';
import { SectionModel } from '../../../../../scraping/student/intranet/Course';

export interface ForumSectionScreenProps {
  section: SectionModel;
}

export interface State {
  isLoading: boolean;
  cacheLoaded: boolean;
  html: string;
}

const TAG = 'ForumSectionScreen';
export default class ForumSectionScreen extends React.Component<
  ForumSectionScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

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
    const { section } = this.props;
    return `forum_section_${section.id}`;
  };
  checkCache = async () => {
    try {
      const data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (html: string, cacheLoaded = false) => {
    this.setState({
      cacheLoaded,
      html,
      isLoading: false,
    });
  };
  loadRequest = async () => {
    const { section } = this.props;
    const { cacheLoaded } = this.state;

    try {
      const item = await UPAO.Student.Intranet.Course.getForumHTML(section);
      this.loadResponse(item);
      CacheStorage.set(this.getCacheKey(), item);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse('');
      } else {
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  componentWillUnmount() {
    UPAO.abort('Course.getForumHTML');
  }

  componentDidMount() {
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
    padding:0 !important;
}

table tr:nth-child(1) > td {
    background: #fafafa !important;
    color: #666 !important;
    padding: 12px 5px !important;
    
    border-right: 1px solid #f4f4f4 !important;
    border-bottom: 1px solid #f4f4f4 !important;
    font-weight: normal !important;
}

table {
    border-collapse: separate;
    border-spacing: 0;
    border-left: none;
}

td {
    padding: 5px;
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
    backgroundColor: '#ffff',
  },
});
