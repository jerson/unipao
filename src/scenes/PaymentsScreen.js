import React from 'react';
import { InteractionManager, Platform, StyleSheet, View } from 'react-native';
import { Theme } from '../themes/styles';
import PropTypes from 'prop-types';
import Loading from '../components/ui/Loading';
import Log from '../modules/logger/Log';
import Request from '../modules/network/Request';
import { TabNavigator } from 'react-navigation';
import PaymentList from '../components/payment/PaymentList';
import { _ } from '../modules/i18n/Translator';
import { tabsOptions } from '../routers/Tabs';
import NavigationButton from '../components/ui/NavigationButton';

const TAG = 'PaymentsScreen';
export default class PaymentsScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
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

  state = {
    isLoading: true,
    isRefreshing: false,
    paymentsGroups: {}
  };

  load = async () => {
    this.setState({ isLoading: true });

    try {
      let response = await Request.post(
        'av/ej/estadocuenta',
        {
          accion: 'LIS'
        },
        { secure: true }
      );

      let { body } = response;
      let paymentsGroups = {};
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
        this.setState({ paymentsGroups, isLoading: false });
      });
    } catch (e) {
      Log.warn(TAG, 'load', e);
      this.setState({ isLoading: false });
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
    let paddingTop = Platform.OS === 'ios' ? 65 : 60;
    return (
      <View style={[styles.container, { paddingTop }]}>
        {/*<Background/>*/}
        {isLoading && <Loading margin />}
        {!isLoading && <PaymentsTab screenProps={{ paymentsGroups }} />}
      </View>
    );
  }
}

const PaymentsTab = TabNavigator(
  {
    UG: {
      screen: ({ navigation, screenProps }) => {
        let { paymentsGroups } = screenProps;
        let payments = paymentsGroups['UG'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('Pregrado')
        };
      }
    },
    GR: {
      screen: ({ navigation, screenProps }) => {
        let { paymentsGroups } = screenProps;
        let payments = paymentsGroups['GR'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('Postgrado')
        };
      }
    },
    UT: {
      screen: ({ navigation, screenProps }) => {
        let { paymentsGroups } = screenProps;
        let payments = paymentsGroups['UT'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('Gente que trabaja')
        };
      }
    },
    UB: {
      screen: ({ navigation, screenProps }) => {
        let { paymentsGroups } = screenProps;
        let payments = paymentsGroups['UB'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('Centro de idiomas')
        };
      }
    },
    EU: {
      screen: ({ navigation, screenProps }) => {
        let { paymentsGroups } = screenProps;
        let payments = paymentsGroups['EU'] || [];
        return <PaymentList payments={payments} />;
      },
      navigationOptions: ({ navigation, screenProps }) => {
        return {
          tabBarLabel: _('Ext. Universitaria')
        };
      }
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
