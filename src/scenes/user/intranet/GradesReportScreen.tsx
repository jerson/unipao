import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
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
import {
  GradeReportCourseModel,
  GradeReportModel,
  ProgramModel
} from '../../../scraping/student/Intranet';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions
} from 'react-navigation';
import GradeReportItem from '../../../components/grade/GradesReportItem';
import GradeReportHeader from '../../../components/grade/GradeReportHeader';
import { Theme } from '../../../themes/styles';

export interface GradesReportScreenProps {
  program: ProgramModel;
  level: string;
}

export interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  cacheLoaded: boolean;
  report?: GradeReportModel;
}

const TAG = 'GradesReportScreen';
export default class GradesReportScreen extends React.Component<
  GradesReportScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  state: State = {
    isLoading: true,
    cacheLoaded: false,
    isRefreshing: false,
    report: undefined
  };

  renderItem = ({
    item,
    index
  }: ListRenderItemInfo<GradeReportCourseModel>) => {
    return <GradeReportItem item={item} />;
  };
  renderHeader = () => {
    let { report } = this.state;
    if (!report) {
      return <View />;
    }
    return <GradeReportHeader report={report} />;
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
    let { level, program } = this.props;
    return `gradesReport_${level || '_'}_${program.id || '_'}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };

  loadResponse = (report?: GradeReportModel, cacheLoaded = false) => {
    this.setState({
      cacheLoaded,
      report,
      isLoading: false,
      isRefreshing: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded } = this.state;

    try {
      let { level, program } = this.props;
      console.log(level, program);
      let report = await UPAO.Student.Intranet.getGradesReport(
        level,
        program.id
      );
      this.loadResponse(report);
      CacheStorage.set(this.getCacheKey(), report);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        Log.info(TAG, 'loadRequest', '!cacheLoaded');
        this.loadResponse(undefined);
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
    UPAO.abort('Intranet.getLevelsGrades');
    UPAO.abort('Intranet.getPrograms');
    UPAO.abort('Intranet.getGradesReport');
  }

  componentDidMount() {
    this.load();
  }

  render() {
    let { report, isLoading, isRefreshing } = this.state;
    let items = report ? report.items || [] : [];
    return (
      <View style={[styles.container]}>
        {!isLoading &&
          items.length < 1 && (
            <AlertMessage
              type={'warning'}
              title={_('No se encontraron datos')}
            />
          )}
        {isLoading && <Loading margin />}
        {!isLoading &&
          report && (
            <FlatList
              data={items}
              extraData={items.length}
              showsVerticalScrollIndicator={true}
              renderItem={this.renderItem}
              ListHeaderComponent={this.renderHeader}
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
