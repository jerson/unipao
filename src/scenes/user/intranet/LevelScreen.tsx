import * as React from 'react';
import {
  ListRenderItemInfo,
  RefreshControl,
  SectionList,
  SectionListData,
  StyleSheet,
  View
} from 'react-native';
import * as PropTypes from 'prop-types';
import Loading from '../../../components/ui/Loading';
import Log from '../../../modules/logger/Log';
import AlertMessage from '../../../components/ui/AlertMessage';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import PeriodHeader from '../../../components/period/PeriodHeader';
import CourseItem from '../../../components/course/CourseItem';
import { CourseModel, PeriodModel } from '../../../scraping/student/Intranet';
import { NavigationScreenProp } from 'react-navigation';

export interface LevelScreenProps {
  navigation: NavigationScreenProp<null, null>;
  level: string;
}

export interface State {
  isLoading: boolean;
  period: any;
  isRefreshing: boolean;
  cacheLoaded: boolean;
  sections: any[];
}

const TAG = 'LevelScreen';
export default class LevelScreen extends React.Component<
  LevelScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {
    isLoading: false,
    period: null,
    cacheLoaded: false,
    isRefreshing: false,
    sections: []
  };

  renderItem = ({ item, index }: ListRenderItemInfo<CourseModel>) => {
    return <CourseItem course={item} navigation={this.props.navigation} />;
  };
  renderHeader = ({ section }: { section: SectionListData<PeriodModel> }) => {
    return <PeriodHeader title={section.title} />;
  };

  load = async () => {
    let { isRefreshing } = this.state;
    if (!isRefreshing) {
      this.setState({ isLoading: true, cacheLoaded: false });
      await this.checkCache();
    }
    await this.loadRequest();
  };
  getCacheKey = () => {
    let { level } = this.props;
    return `level_${level || '_'}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };

  loadResponse = (data: any, cacheLoaded = false) => {
    let sections = [];
    if (data) {
      sections = data;
    }
    this.setState({
      cacheLoaded,
      sections,
      isLoading: false,
      isRefreshing: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded } = this.state;

    try {
      let { level } = this.props;
      let periods = await UPAO.Student.Intranet.getHistoryCourses(level);

      let sections = periods.map(period => {
        return {
          title: period.period,
          data: period.courses
        };
      });

      this.loadResponse(sections);
      CacheStorage.set(this.getCacheKey(), sections);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        Log.info(TAG, 'loadRequest', '!cacheLoaded');
        this.loadResponse([]);
      } else {
        Log.info(TAG, 'loadRequest', 'cacheLoaded');
        this.setState({ isLoading: false, isRefreshing: false });
      }
    }
  };
  reload = () => {
    this.onRefresh();
  };

  onRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.load();
    });
  };

  componentWillUnmount() {
    UPAO.abort('Course.getHistoryCourses');
  }

  componentDidMount() {
    this.load();
  }

  render() {
    let { sections, isLoading, isRefreshing } = this.state;

    return (
      <View style={[styles.container]}>
        {/*<Background/>*/}
        {!isLoading &&
          sections.length < 1 && (
            <AlertMessage
              type={'warning'}
              title={_('No se encontraron datos')}
            />
          )}
        {isLoading && <Loading margin />}
        {!isLoading && (
          <SectionList
            sections={sections}
            stickySectionHeadersEnabled
            showsVerticalScrollIndicator={true}
            renderItem={this.renderItem}
            renderSectionHeader={this.renderHeader}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.onRefresh}
              />
            }
            keyExtractor={(item, index) => {
              return index.toString();
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
    backgroundColor: '#fff'
  }
});
