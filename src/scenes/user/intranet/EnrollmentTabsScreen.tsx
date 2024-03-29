import * as React from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import * as PropTypes from 'prop-types';
import Loading from '../../../components/ui/Loading';
import Log from '../../../modules/logger/Log';
import AlertMessage from '../../../components/ui/AlertMessage';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import { PeriodModel } from '../../../scraping/student/Intranet';
import {
  NavigationContainer,
  NavigationRouteConfigMap,
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationTabScreenOptions,
  TabNavigator
} from 'react-navigation';
import { Color, Theme } from '../../../themes/styles';
import NavigationButton from '../../../components/ui/NavigationButton';
import { tabsOptions } from '../../../routers/Tabs';
import EnrollmentScreen from './EnrollmentScreen';

export interface EnrollmentTabsScreenProps {
  navigation: NavigationScreenProp<null, null>;
  level: string;
}

export interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  cacheLoaded: boolean;
  periods?: PeriodModel[];
  Tabs?: NavigationContainer;
}

const TAG = 'EnrollmentTabsScreen';
export default class EnrollmentTabsScreen extends React.Component<
  EnrollmentTabsScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };
  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: _('Ficha de matricula'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
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
    periods: [],
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
    return `enrollmentPeriods_${level || '_'}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };
  loadResponse = (periods: PeriodModel[], cacheLoaded = false) => {
    let tabs: NavigationRouteConfigMap = {};
    let { level } = this.getParams();

    let i = 0;
    for (let period of periods) {
      let name = period.name || 'ERR';

      let year = name.slice(0, 4);
      let periodCode = name.slice(4, 7);
      tabs['tab' + i] = {
        screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
          return <EnrollmentScreen level={level} period={period.id} />;
        },
        navigationOptions: {
          tabBarLabel: `${year}-${periodCode}`
        } as NavigationTabScreenOptions
      };
      i++;
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
      ...tabsOptions,
      tabBarOptions: {
        ...tabsOptions.tabBarOptions,
        scrollEnabled: totalTabs.length > 3,
        tabStyle: {
          flexDirection: 'row',
          width: 80,
          padding: 4
        }
      }
    });

    this.setState({
      cacheLoaded,
      periods,
      Tabs,
      isLoading: false,
      isRefreshing: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded } = this.state;

    try {
      let { level } = this.getParams();
      let periods = await UPAO.Student.Intranet.Enrollment.getPeriods(level);

      this.loadResponse(periods);
      CacheStorage.set(this.getCacheKey(), periods);
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

  getParams(): any {
    let { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentWillUnmount() {
    UPAO.abort('Enrollment.getPeriods');
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });

    this.load();
  }

  render() {
    let { Tabs, isLoading } = this.state;
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
