import * as React from 'react';
import { InteractionManager, StyleSheet, View } from 'react-native';
import { Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
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
import PaymentList from '../../components/payment/PaymentList';
import { _ } from '../../modules/i18n/Translator';
import { tabsOptions } from '../../routers/Tabs';
import NavigationButton from '../../components/ui/NavigationButton';
import CacheStorage from '../../modules/storage/CacheStorage';

export interface PaymentsScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  isLoading: boolean;
  cacheLoaded: boolean;
  paymentsGroups: any;
}

const TAG = 'PaymentsScreen';
export default class PaymentsScreen extends React.Component<
  PaymentsScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: _('Estado de cuenta'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [Theme.navigationBar, Theme.subNavigationBar],
    headerRight: (
      <NavigationButton
        onPress={() => {
          navigation.state.params.reload();
        }}
        icon={'refresh'}
        iconType={'MaterialIcons'}
      />
    )
  });

  state: State = {
    isLoading: true,
    cacheLoaded: false,
    paymentsGroups: {}
  };

  load = async () => {
    this.setState({ isLoading: true, cacheLoaded: false });
    await this.checkCache();

    await this.loadRequest();
  };
  getCacheKey = () => {
    return `payments`;
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
    let paymentsGroups: any = {};
    if (body.data) {
      let data = JSON.parse(body.data);

      for (let payment of data) {
        let level = payment.NIVEL || 'ERR';
        if (!paymentsGroups[level]) {
          paymentsGroups[level] = [];
        }
        paymentsGroups[level].push(payment);
      }
    }
    InteractionManager.runAfterInteractions(() => {
      this.setState({ cacheLoaded, paymentsGroups, isLoading: false });
    });
  };
  loadRequest = async () => {
    let { cacheLoaded } = this.state;
    try {
      let response = await Request.post(
        'av/ej/estadocuenta',
        {
          accion: 'LIS'
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

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.load });

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        this.load();
      }, 300);
    });
  }

  render() {
    let { paymentsGroups, isLoading } = this.state;
    return (
      <View style={[styles.container]}>
        {isLoading && <Loading margin />}
        {!isLoading && <PaymentsTab screenProps={{ paymentsGroups }} />}
      </View>
    );
  }
}

const PaymentsTab = TabNavigator(
  {
    UG: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let paymentsGroups = screenProps
          ? screenProps.paymentsGroups || {}
          : {};
        let payments = paymentsGroups['UG'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: {
        tabBarLabel: _('Pregrado')
      } as NavigationTabScreenOptions
    },
    GR: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let paymentsGroups = screenProps
          ? screenProps.paymentsGroups || {}
          : {};
        let payments = paymentsGroups['GR'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: {
        tabBarLabel: _('Postgrado')
      } as NavigationTabScreenOptions
    },
    UT: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let paymentsGroups = screenProps
          ? screenProps.paymentsGroups || {}
          : {};
        let payments = paymentsGroups['UT'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: {
        tabBarLabel: _('Gente que trabaja')
      } as NavigationTabScreenOptions
    },
    UB: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let paymentsGroups = screenProps
          ? screenProps.paymentsGroups || {}
          : {};
        let payments = paymentsGroups['UB'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: {
        tabBarLabel: _('Centro de idiomas')
      } as NavigationTabScreenOptions
    },
    EU: {
      screen: ({ navigation, screenProps }: NavigationScreenConfigProps) => {
        let paymentsGroups = screenProps
          ? screenProps.paymentsGroups || {}
          : {};
        let payments = paymentsGroups['EU'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: {
        tabBarLabel: _('Ext. Universitaria')
      } as NavigationTabScreenOptions
    }
  },
  {
    ...tabsOptions,
    tabBarOptions: {
      ...tabsOptions.tabBarOptions,
      tabStyle: {
        flexDirection: 'row',
        width: 130,
        padding: 0
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
