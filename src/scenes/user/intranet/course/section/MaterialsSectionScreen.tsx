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

export interface MaterialsSectionScreenProps {
  section: SectionModel;
}

export interface State {
  isLoading: boolean;
  cacheLoaded: boolean;
  html: string;
}

const TAG = 'MaterialsSectionScreen';
export default class MaterialsSectionScreen extends React.Component<
  MaterialsSectionScreenProps,
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
    let { section } = this.props;
    return `materials_section_${section.id}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (html: string, cacheLoaded = false) => {
    this.setState({
      cacheLoaded,
      html,
      isLoading: false
    });
  };
  loadRequest = async () => {
    let { section } = this.props;
    let { cacheLoaded } = this.state;

    try {
      let item = await UPAO.Student.Intranet.Course.getMaterialsHTML(section);
      this.loadResponse(item);
      CacheStorage.set(this.getCacheKey(), item);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse('');
      } else {
        this.setState({
          isLoading: false
        });
      }
    }
  };

  componentWillUnmount() {
    UPAO.abort('Course.getMaterialsHTML');
  }

  componentDidMount() {
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
    font-size: 13px !important;
    font-family: Roboto,Helvetica,Arial,serif;
    border: none !important;
    color: #444 !important;
    width: auto !important;
    margin: 0 !important;
    border-radius: 0 !important;
    /* padding: 0 !important; */
}

img {
    display: none;
}

div[style*="width:95%"] {
    margin-top: 10px !important;
    padding-left: 8px !important;
    border-top: 1px solid #efefef !important;
    padding-top: 10px;
    padding-right: 8px !important;
}

span[style*="color:#0A60BB"] {
    color: #666 !important;
    font-size: 12px !important;
}

div[style*="color:#666666"] {
    color: #ff7a00 !important;
}

table tr > td:nth-child(1) {
    display: flex;
    flex-direction: column;
    flex: 1;
}

span[style*="font-size:10px;font-weight:normal;color:#CCCCCC;"] {
    color: #999 !important;
    font-size: 11px !important;
    margin-top: 5px !important;
}

table tr {
    display: flex;
    flex: 1;
    width: 100% !important;
}

table {
    width: 100% !important;
}

div[style*="width:90%"] {
    padding-right: 8px !important;
    padding-left: 4px !important;
}

span[style*="color:#00CC66"] {
    color: #00CC66 !important;
    font-size: 22px !important;
}

div[style*="border-radius:10px 10px 10px 10px"] {
    padding: 8px !important;
    padding-top: 0 !important;
    margin: 0 !important;
}

*[onclick] {
    display: none !important;
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
            // openInternally={['campusvirtual.upao.edu.pe']}
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
    flex: 1,
    backgroundColor: '#ffff'
  }
});
