import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Loading from '../../../components/ui/Loading';
import Log from '../../../modules/logger/Log';
import AlertMessage from '../../../components/ui/AlertMessage';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import { LevelModel } from '../../../scraping/student/Intranet';
import {
  createMaterialTopTabNavigator,
  NavigationContainer,
  NavigationRouteConfigMap,
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationTabScreenOptions,
} from 'react-navigation';
import { Color, Theme } from '../../../themes/styles';
import NavigationButton from '../../../components/ui/NavigationButton';
import { tabsOptions } from '../../../routers/Tabs';
import GradesReportScreen from './GradesReportScreen';
import { ProgramModel } from '../../../scraping/student/intranet/Grade';

export interface GradesReportTabsScreenProps {
  navigation: NavigationScreenProp<any, any>;
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
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions = ({
    navigation,
    screenProps,
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: _('Reporte de notas'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [Theme.navigationBar, Theme.subNavigationBar],
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
    isLoading: true,
    cacheLoaded: false,
    isRefreshing: false,
    programs: [],
    Tabs: undefined,
  };

  load = async () => {
    const { isRefreshing } = this.state;
    if (!isRefreshing) {
      this.setState({ isLoading: true, cacheLoaded: false });
      await this.checkCache();
    }
    await this.loadRequest();
  };
  getCacheKey = () => {
    const { level } = this.getParams();
    return `gradesReportPrograms_${level || '_'}`;
  };
  checkCache = async () => {
    try {
      const data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (
    data: { programs: ProgramModel[]; levelGrade?: LevelModel },
    cacheLoaded = false
  ) => {
    const { programs, levelGrade } = data;
    let tabs: NavigationRouteConfigMap = {};

    for (const program of programs) {
      const name = program.name || 'ERR';
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
          tabBarLabel: program.name,
        } as NavigationTabScreenOptions,
      };
    }
    const totalTabs = Object.keys(tabs);
    if (totalTabs.length < 1) {
      tabs = {
        NO: {
          screen: () => {
            return <AlertMessage message={_('No hay datos')} />;
          },
          navigationOptions: {
            tabBarLabel: _('Error'),
          } as NavigationTabScreenOptions,
        },
      };
    }
    const Tabs = createMaterialTopTabNavigator(tabs, {
      ...tabsOptions,
      tabBarOptions: {
        ...tabsOptions.tabBarOptions,
        scrollEnabled: totalTabs.length > 2,
      },
    });

    this.setState({
      cacheLoaded,
      programs,
      Tabs,
      isLoading: false,
      isRefreshing: false,
    });
  };
  loadRequest = async () => {
    const { cacheLoaded } = this.state;

    try {
      const { level } = this.getParams();
      const levelGrade = await UPAO.Student.Intranet.Grade.getLevelByCode(
        level
      );
      const programs = await UPAO.Student.Intranet.Grade.getPrograms(
        levelGrade.id
      );
      const data = { programs, levelGrade };
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
    const { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentWillUnmount() {
    UPAO.abort('Grade.getLevels');
    UPAO.abort('Grade.getPrograms');
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });

    this.load();
  }

  render() {
    const { Tabs, isLoading } = this.state;
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
    backgroundColor: '#fff',
  },
});
