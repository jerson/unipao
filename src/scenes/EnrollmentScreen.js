import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Theme } from '../themes/styles';
import PropTypes from 'prop-types';
import NavigationButton from '../components/ui/NavigationButton';
import Loading from '../components/ui/Loading';
import Log from '../modules/logger/Log';
import Request from '../modules/network/Request';
import EnrollmentList from '../components/enrollment/EnrollmentList';
import { TabNavigator } from 'react-navigation';
import { tabsOptions } from '../routers/Tabs';
import PeriodModal from '../components/period/PeriodModal';
import { _ } from '../modules/i18n/Translator';
import CacheStorage from '../modules/storage/CacheStorage';

const TAG = 'EnrollmentScreen';
export default class EnrollmentScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
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

  state = {
    isLoading: true,
    period: null,
    careers: {}
  };

  EnrollmentTabs = null;

  onChangePeriod = period => {
    this.setState({ period }, () => {
      this.load();
    });
  };

  load = async (skipCache = false) => {
    this.setState({ isLoading: true });
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

  loadResponse = (body, cacheLoaded = false) => {
    let careers = {};
    let tabs = {};

    if (body.data) {
      let enrollments = JSON.parse(body.data);
      for (let enrollment of enrollments) {
        let name = enrollment.CARR || 'ERR';
        if (!careers[name]) {
          careers[name] = [];
        }
        if (!tabs[name]) {
          tabs[name] = {
            screen: ({ navigation, screenProps }) => {
              let { careers } = screenProps;
              let enrollments = careers[name] || [];
              return <EnrollmentList enrollments={enrollments} />;
            },
            navigationOptions: ({ navigation, screenProps }) => {
              return {
                tabBarLabel: enrollment.CARRERA
              };
            }
          };
        }
        careers[name].push(enrollment);
      }

    }
      this.EnrollmentTabs = TabNavigator(tabs, {
          ...tabsOptions,
          tabBarOptions: {
              ...tabsOptions.tabBarOptions,
              scrollEnabled: false
          }
      });
    this.setState({ careers, cacheLoaded, isLoading: false });
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

  reload = () => {
    this.load(true);
  };
  togglePeriods = () => {
    this.refs.periods.show();
  };

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
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
    let paddingTop = Platform.OS === 'ios' ? 65 : 60;
    let { careers, period, isLoading } = this.state;
    let { EnrollmentTabs } = this;
    return (
      <View style={[styles.container, { paddingTop }]}>
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
