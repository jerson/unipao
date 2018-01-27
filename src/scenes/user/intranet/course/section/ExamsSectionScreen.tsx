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

export interface ExamsSectionScreenProps {
  section: SectionModel;
}

export interface State {
  isLoading: boolean;
  cacheLoaded: boolean;
  html: string;
}

const TAG = 'ExamsSectionScreen';
export default class ExamsSectionScreen extends React.Component<
  ExamsSectionScreenProps,
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
    return `exams_section_${section.id}`;
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
      let item = await UPAO.Student.Intranet.Course.getExamsHTML(section);
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

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    UPAO.abort('Course.getExamsHTML');
  }

  render() {
    let { html, isLoading } = this.state;
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
    flex: 1,
    backgroundColor: '#ffff'
  }
});
