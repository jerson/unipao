import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import NavigationButton from '../../components/ui/NavigationButton';
import Loading from '../../components/ui/Loading';
import Log from '../../modules/logger/Log';
import Request from '../../modules/network/Request';
import EnrollmentList from '../../components/enrollment/EnrollmentList';
import {
  NavigationNavigatorProps,
  NavigationScreenConfigProps,
  NavigationScreenProp,
  TabNavigator
} from 'react-navigation';
import { tabsOptions } from '../../routers/Tabs';
import PeriodModal from '../../components/period/PeriodModal';
import { _ } from '../../modules/i18n/Translator';
import CacheStorage from '../../modules/storage/CacheStorage';

export interface EnrollmentScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  cacheLoaded: boolean;
  isLoading: boolean;
  period: any;
  tabs: any;
  careers: any;
}

const TAG = 'EnrollmentScreen';
export default class EnrollmentScreen extends React.Component<
  EnrollmentScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationScreenConfigProps) => ({
    title: _('Ficha de matrícula'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
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

  state: State = {
    isLoading: true,
    period: null,
    cacheLoaded: false,
    tabs: null,
    careers: {}
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
    return `enrollment_${period.PERIODO || '_'}`;
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
    let careers: any = {};
    let tabs: any = {};

    if (body.data) {
      let enrollments = JSON.parse(body.data);
      for (let enrollment of enrollments) {
        let name = enrollment.CARR || 'ERR';
        if (!careers[name]) {
          careers[name] = [];
        }
        if (!tabs[name]) {
          tabs[name] = {
            screen: ({
              navigation,
              screenProps
            }: NavigationNavigatorProps<null>) => {
              let careers = screenProps ? screenProps.careers || {} : {};
              let enrollments = careers[name] || [];
              return <EnrollmentList enrollments={enrollments} />;
            },
            navigationOptions: ({
              navigation,
              screenProps
            }: NavigationNavigatorProps<null>) => {
              return {
                tabBarLabel: enrollment.CARRERA
              };
            }
          };
        }
        careers[name].push(enrollment);
      }
    }

    let totalTabs = Object.keys(tabs);
    if (totalTabs.length < 1) {
      tabs = {
        NO: {
          screen: ({
            navigation,
            screenProps
          }: NavigationNavigatorProps<null>) => {
            return <EnrollmentList enrollments={[]} />;
          },
          navigationOptions: ({
            navigation,
            screenProps
          }: NavigationNavigatorProps<null>) => {
            return {
              tabBarLabel: _('No se encontraron datos')
            };
          }
        }
      };
    }
    let EnrollmentTabs = TabNavigator(tabs, {
      ...tabsOptions,
      tabBarOptions: {
        ...tabsOptions.tabBarOptions,
        scrollEnabled: false
      }
    });
    this.setState({
      careers,
      cacheLoaded,
      tabs: EnrollmentTabs,
      isLoading: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded, period } = this.state;

    try {
      let response = await Request.post(
        'av/ej/fichamatricula',
        {
          accion: 'LIS_MATRICULA',
          nivel: period.NIVEL,
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

  refs: {
    periods: PeriodModal;
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
    let { careers, period, tabs, isLoading } = this.state;
    let EnrollmentTabs = tabs;
    return (
      <View style={[styles.container]}>
        {period && (
          <PeriodModal
            ref={'periods'}
            period={period}
            onChange={this.onChangePeriod}
          />
        )}

        {/*<Background/>*/}
        {isLoading && <Loading margin />}
        {!isLoading &&
          EnrollmentTabs && <EnrollmentTabs screenProps={{ careers }} />}
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
