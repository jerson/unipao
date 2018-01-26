import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { Theme } from '../../themes/styles';
import * as PropTypes from 'prop-types';
import NavigationButton from '../../components/ui/NavigationButton';
import Loading from '../../components/ui/Loading';
import Log from '../../modules/logger/Log';
import Request from '../../modules/network/Request';
import AssistItem from '../../components/assist/AssistItem';
import PeriodModal from '../../components/period/PeriodModal';
import AlertMessage from '../../components/ui/AlertMessage';
import {
  NavigationScreenConfigProps,
  NavigationScreenProp
} from 'react-navigation';
import CacheStorage from '../../modules/storage/CacheStorage';
import { _ } from '../../modules/i18n/Translator';

export interface AssistsScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  isLoading: boolean;
  period: any;
  cacheLoaded: boolean;
  isRefreshing: boolean;
  assists: any[];
}

const TAG = 'AssistsScreen';
export default class AssistsScreen extends React.Component<
  AssistsScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({
    navigation,
    screenProps
  }: NavigationScreenConfigProps) => ({
    title: _('Mis Asistencias'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.subTintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ],
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

  refs: {
    periods: PeriodModal;
  };
  state: State = {
    isLoading: false,
    period: null,
    isRefreshing: false,
    cacheLoaded: false,
    assists: []
  };

  renderItem = ({ item, index }: ListRenderItemInfo<any>) => {
    return <AssistItem assist={item} />;
  };
  onChangePeriod = (period: any) => {
    this.setState({ period }, () => {
      this.load();
    });
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
    let { period } = this.state;
    return `assists_${period.PERIODO || '_'}`;
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
    let assists = [];
    if (body.data) {
      assists = JSON.parse(body.data);
    }
    this.setState({
      cacheLoaded,
      assists,
      isLoading: false,
      isRefreshing: false
    });
  };
  loadRequest = async () => {
    let { cacheLoaded, period } = this.state;

    try {
      let response = await Request.post(
        'av/ej/asistencia',
        {
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
        Log.info(TAG, 'loadRequest', '!cacheLoaded');
        this.loadResponse({});
      } else {
        Log.info(TAG, 'loadRequest', 'cacheLoaded');
        this.setState({ isLoading: false, isRefreshing: false });
      }
    }
  };

  reload = () => {
    this.onRefresh();
  };
  togglePeriods = () => {
    this.refs.periods.show();
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

  componentDidMount() {
    this.props.navigation.setParams({ reload: this.reload });
    this.props.navigation.setParams({
      togglePeriods: this.togglePeriods
    });
    let { period } = this.getParams();
    this.onChangePeriod(period);
  }

  render() {
    let { assists, period, isLoading, isRefreshing } = this.state;

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
        {!isLoading &&
          assists.length < 1 && (
            <AlertMessage
              type={'warning'}
              title={_('No se econtró registro de asistencias')}
            />
          )}
        {isLoading && <Loading margin />}
        {!isLoading && (
          <FlatList
            showsVerticalScrollIndicator={true}
            data={assists}
            renderItem={this.renderItem}
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
