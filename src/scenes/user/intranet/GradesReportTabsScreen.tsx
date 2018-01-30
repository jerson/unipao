import * as React from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Loading from '../../../components/ui/Loading';
import Log from '../../../modules/logger/Log';
import AlertMessage from '../../../components/ui/AlertMessage';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import { LevelModel, ProgramModel } from '../../../scraping/student/Intranet';
import {
  NavigationContainer,
  NavigationRouteConfigMap,
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationTabScreenOptions,
  TabNavigator
} from 'react-navigation';
import { Theme } from '../../../themes/styles';
import NavigationButton from '../../../components/ui/NavigationButton';
import { tabsOptions } from '../../../routers/Tabs';
import GradesReportScreen from './GradesReportScreen';

export interface GradesReportTabsScreenProps {
  navigation: NavigationScreenProp<null, null>;
  level: string;
}

export interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  cacheLoaded: boolean;
  programs?: ProgramModel[];
  Tabs?: NavigationContainer;
}

const TAG = 'GradesReportTabsScreen';
export default class GradesReportTabsScreen extends React.Component<
  GradesReportTabsScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: _('Reporte de notas'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [Theme.navigationBar, Theme.subNavigationBar],
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

  state: State = {
    isLoading: true,
    cacheLoaded: false,
    isRefreshing: false,
    programs: [],
    Tabs: undefined
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
    let { level } = this.getParams();
    return `gradesReportPrograms_${level || '_'}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (
    data: { programs: ProgramModel[]; levelGrade?: LevelModel },
    cacheLoaded = false
  ) => {
    let { programs, levelGrade } = data;
    let tabs: NavigationRouteConfigMap = {};

    for (let program of programs) {
      let name = program.name || 'ERR';
      tabs[name] = {
        screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
          return (
            <GradesReportScreen
              level={levelGrade ? levelGrade.id : 'error'}
              program={program}
            />
          );
        },
        navigationOptions: {
          tabBarLabel: program.name
        } as NavigationTabScreenOptions
      };
    }
    let totalTabs = Object.keys(tabs);
    if (totalTabs.length < 1) {
      tabs = {
        NO: {
          screen: () => {
            return <AlertMessage message={_('No hay datos')} />;
          },
          navigationOptions: {
            tabBarLabel: _('Error')
          } as NavigationTabScreenOptions
        }
      };
    }
    let Tabs = TabNavigator(tabs, {
      ...tabsOptions
    });

    this.setState({
      cacheLoaded,
      programs,
      Tabs,
      isLoading: false,
      isRefreshing: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded } = this.state;

    try {
      let { level } = this.getParams();
      let levelGrade = await UPAO.Student.Intranet.getLevelGradeByLevel(level);
      let programs = await UPAO.Student.Intranet.getPrograms(levelGrade.id);
      let data = { programs, levelGrade };
      this.loadResponse(data);
      CacheStorage.set(this.getCacheKey(), data);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        Log.info(TAG, 'loadRequest', '!cacheLoaded');
        this.loadResponse({ programs: [], levelGrade: undefined });
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

  getParams(): any {
    let { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentWillUnmount() {
    UPAO.abort('Intranet.getLevelsGrades');
    UPAO.abort('Intranet.getPrograms');
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });

    this.load();
  }

  render() {
    let { Tabs, programs, isLoading } = this.state;
    return (
      <View style={[styles.container]}>
        {isLoading && <Loading margin />}
        {!isLoading && Tabs && <Tabs />}
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
