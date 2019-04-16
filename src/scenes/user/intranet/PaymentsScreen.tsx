import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import * as PropTypes from 'prop-types';
import Loading from '../../../components/ui/Loading';
import Log from '../../../modules/logger/Log';
import AlertMessage from '../../../components/ui/AlertMessage';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import { PaymentModel } from '../../../scraping/student/Intranet';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';
import PaymentItem from '../../../components/payment/PaymentItem';
import PaymentHeader from '../../../components/payment/PaymentHeader';
import { Color, Theme } from '../../../themes/styles';
import NavigationButton from '../../../components/ui/NavigationButton';

export interface PaymentsScreenProps {
  navigation: NavigationScreenProp<any, any>;
  level: string;
}

export interface State {
  isLoading: boolean;
  isRefreshing: boolean;
  cacheLoaded: boolean;
  payments: PaymentModel[];
}

const TAG = 'PaymentsScreen';
export default class PaymentsScreen extends React.Component<
  PaymentsScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions = ({
    navigation,
    screenProps,
  }: NavigationScreenConfigProps): NavigationStackScreenOptions => ({
    title: _('Historial de pagos'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
    ],
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
    payments: [],
  };

  renderItem = ({ item, index }: ListRenderItemInfo<PaymentModel>) => {
    return <PaymentItem payment={item} />;
  };
  renderHeader = () => {
    const { payments } = this.state;
    return <PaymentHeader payments={payments} />;
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
    return `payments_${level || '_'}`;
  };
  checkCache = async () => {
    try {
      const data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };

  loadResponse = (payments: PaymentModel[], cacheLoaded = false) => {
    this.setState({
      cacheLoaded,
      payments,
      isLoading: false,
      isRefreshing: false,
    });
  };
  loadRequest = async () => {
    const { cacheLoaded } = this.state;

    try {
      const { level } = this.getParams();
      const payments = await UPAO.Student.Intranet.getPayments(level);
      this.loadResponse(payments);
      CacheStorage.set(this.getCacheKey(), payments);
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
    const { params } = this.props.navigation.state || { params: {} };
    return params;
  }

  componentWillUnmount() {
    UPAO.abort('Intranet.getPayments');
  }

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });

    this.load();
  }

  render() {
    const { payments, isLoading, isRefreshing } = this.state;

    return (
      <View style={[styles.container]}>
        {!isLoading && payments.length < 1 && (
          <AlertMessage type={'warning'} title={_('No se encontraron datos')} />
        )}
        {isLoading && <Loading margin />}
        {!isLoading && (
          <FlatList
            data={payments}
            extraData={(payments || []).length}
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
    backgroundColor: '#fff',
  },
});
