import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Theme } from '../../themes/styles';
import PropTypes from 'prop-types';
import NavigationButton from '../../components/ui/NavigationButton';
import Loading from '../../components/ui/Loading';
import Log from '../../modules/logger/Log';
import Request from '../../modules/network/Request';
import AssistItem from '../../components/assist/AssistItem';
import PeriodModal from '../../components/period/PeriodModal';
import AlertMessage from '../../components/ui/AlertMessage';
import { _ } from '../../modules/i18n/Translator';
import CacheStorage from '../../modules/storage/CacheStorage';
import DimensionUtil from '../../modules/util/DimensionUtil';
import UPAO from '../../scraping/UPAO';

const TAG = 'LevelScreen';
export default class LevelScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: _('Intranet'),
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
            navigation.state.params.reload();
          }}
          icon={'refresh'}
          iconType={'MaterialIcons'}
        />
      </View>
    )
  });

  state = {
    isLoading: false,
    period: null,
    isRefreshing: false,
    assists: []
  };

  renderItem = ({ item, index }) => {
    return <AssistItem assist={item} />;
  };
  onChangePeriod = period => {
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
    let { level } = this.props;
    return `assists_${level || '_'}`;
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
      let { level } = this.props;
      let data = await UPAO.Student.Intranet.getHistoryCourses(level);

      console.log(data);
      this.loadResponse({});
      CacheStorage.set(this.getCacheKey(), {});
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

  getParams() {
    let { state } = this.props.navigation;
    return state.params || {};
  }

  componentDidMount() {
    // this.props.navigation.setParams({ reload: this.reload });
  }

  render() {
    let paddingTop = DimensionUtil.getNavigationBarHeight();
    let { assists, period, isLoading, isRefreshing } = this.state;

    return (
      <View style={[styles.container]}>
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
              return index;
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
