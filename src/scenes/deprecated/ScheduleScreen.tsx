import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Color, Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import NavigationButton from '../../components/ui/NavigationButton';
import Loading from '../../components/ui/Loading';
import Log from '../../modules/logger/Log';
import Request from '../../modules/network/Request';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
  NavigationTabScreenOptions,
  TabNavigator
} from 'react-navigation';
import { _ } from '../../modules/i18n/Translator';
import { tabsOptions } from '../../routers/Tabs';
import ScheduleList from '../../components/schedule/ScheduleList';
import PeriodModal from '../../components/period/PeriodModal';
import CacheStorage from '../../modules/storage/CacheStorage';

export interface ScheduleScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  isLoading: boolean;
  cacheLoaded: boolean;
  period: any;
  scheduleDays: any;
}

const TAG = 'ScheduleScreen';
export default class ScheduleScreen extends React.Component<
  ScheduleScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: _('Mi Horario'),
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [Theme.navigationBar, Theme.subNavigationBar],
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <NavigationButton
          onPress={() => {
            navigation.state.params.togglePeriods();
          }}
          icon={'filter'}
          iconType={'Feather'}
        />
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

  refs: any;
  state: State = {
    isLoading: true,
    cacheLoaded: false,
    period: null,
    scheduleDays: {}
  };

  onChangePeriod = (period: any) => {
    this.setState({ period }, () => {
      this.load();
    });
  };
  load = async (skipCache = false) => {
    this.setState({ isLoading: true, cacheLoaded: false });
    if (!skipCache) {
      await this.checkCache();
    }

    await this.loadRequest();
  };
  getCacheKey = () => {
    let { period } = this.state;
    return `schedule_${period.PERIODO || '_'}`;
  };
  checkCache = async () => {
    try {
      let data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };

  loadResponse = (body: any, cacheLoaded = false) => {
    let scheduleDays: any = {};
    if (body.data) {
      let data = JSON.parse(body.data);

      for (let schedule of data) {
        let day = schedule.DIA || 'ERR';
        if (!scheduleDays[day]) {
          scheduleDays[day] = [];
        }
        scheduleDays[day].push(schedule);
      }
    }
    this.setState({ cacheLoaded, scheduleDays, isLoading: false });
  };
  loadRequest = async () => {
    let { cacheLoaded, period } = this.state;

    try {
      let response = await Request.post(
        'av/ej/horario',
        {
          accion: 'LIS',
          periodo: period.PERIODO
        },
        { secure: true }
      );

      let { body } = response;
      this.loadResponse(body);
      CacheStorage.set(this.getCacheKey(), body);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse({});
      } else {
        this.setState({ isLoading: false });
      }
    }
  };

  reload = () => {
    this.load(true);
  };

  togglePeriods = () => {
    this.refs.periods.show();
  };

  getParams(): any {
    let { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    this.props.navigation.setParams({
      togglePeriods: this.togglePeriods
    });
    let { period } = this.getParams();
    this.onChangePeriod(period);
  }

  render() {
    let { scheduleDays, period, isLoading } = this.state;
    return (
      <View style={[styles.container]}>
        {period && (
          <PeriodModal
            ref={'periods'}
            period={period}
            onChange={this.onChangePeriod}
          />
        )}

        {isLoading && <Loading margin />}
        {!isLoading && <ScheduleTab screenProps={{ scheduleDays }} />}
      </View>
    );
  }
}

const ScheduleTab = TabNavigator(
  {
    LUN: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let scheduleDays = screenProps ? screenProps.scheduleDays || {} : {};
        let schedule = scheduleDays['LUN'] || [];
        return <ScheduleList schedule={schedule} />;
      },
      navigationOptions: {
        tabBarLabel: _('Lunes')
      } as NavigationTabScreenOptions
    },
    MAR: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let scheduleDays = screenProps ? screenProps.scheduleDays || {} : {};
        let schedule = scheduleDays['MAR'] || [];
        return <ScheduleList schedule={schedule} />;
      },
      navigationOptions: {
        tabBarLabel: _('Martes')
      } as NavigationTabScreenOptions
    },
    MIE: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let scheduleDays = screenProps ? screenProps.scheduleDays || {} : {};
        let schedule = scheduleDays['MIE'] || [];
        return <ScheduleList schedule={schedule} />;
      },
      navigationOptions: {
        tabBarLabel: _('Miercoles')
      } as NavigationTabScreenOptions
    },
    JUE: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let scheduleDays = screenProps ? screenProps.scheduleDays || {} : {};
        let schedule = scheduleDays['JUE'] || [];
        return <ScheduleList schedule={schedule} />;
      },
      navigationOptions: {
        tabBarLabel: _('Jueves')
      } as NavigationTabScreenOptions
    },
    VIE: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let scheduleDays = screenProps ? screenProps.scheduleDays || {} : {};
        let schedule = scheduleDays['VIE'] || [];
        return <ScheduleList schedule={schedule} />;
      },
      navigationOptions: {
        tabBarLabel: _('Viernes')
      } as NavigationTabScreenOptions
    },
    SAB: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let scheduleDays = screenProps ? screenProps.scheduleDays || {} : {};
        let schedule = scheduleDays['SAB'] || [];
        return <ScheduleList schedule={schedule} />;
      },
      navigationOptions: {
        tabBarLabel: _('Sabado')
      } as NavigationTabScreenOptions
    },
    DOM: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let scheduleDays = screenProps ? screenProps.scheduleDays || {} : {};

        let schedule = scheduleDays['DOM'] || [];
        return <ScheduleList schedule={schedule} />;
      },
      navigationOptions: {
        tabBarLabel: _('Domingo')
      } as NavigationTabScreenOptions
    }
  },
  {
    ...tabsOptions,
    tabBarOptions: {
      ...tabsOptions.tabBarOptions,
      tabStyle: {
        flexDirection: 'row',
        width: 100,
        padding: 4
      }
    }
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
