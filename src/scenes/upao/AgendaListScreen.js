import React from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Theme } from '../../themes/styles';
import PropTypes from 'prop-types';
import Request from '../../modules/network/Request';
import Log from '../../modules/logger/Log';
import Loading from '../../components/ui/Loading';
import AgendaItem from '../../components/agenda/AgendaItem';
import moment from 'moment';
import { _ } from '../../modules/i18n/Translator';
import CacheStorage from '../../modules/storage/CacheStorage';
import DimensionUtil from '../../modules/util/DimensionUtil';

const TAG = 'AgendaListScreen';
export default class AgendaListScreen extends React.Component {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions = {
    title: _('Agenda del més'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Theme.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault
    ]
  };

  state = {
    agendaList: [],
    month: moment().format('MM'),
    year: moment().format('YYYY'),
    isRefreshing: false
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
    let { month, year } = this.state;
    return `agendaList_${month}_${year}`;
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
    let data = [];
    let exist = false;
    let i = 0;
    if (body.data) {
      data = JSON.parse(body.data);
      exist = false;
      for (let item of data) {
        let isToday = this.isToday(item);
        if (isToday) {
          exist = true;
          break;
        }
        i++;
      }
    }
    this.setState(
      { agendaList: data, cacheLoaded, isLoading: false, isRefreshing: false },
      () => {
        if (!exist) {
          return;
        }
        setTimeout(() => {
          this.refs.list &&
            this.refs.list.scrollToIndex({
              animated: true,
              index: i,
              viewPosition: 0.5
            });
        }, 1000);
      }
    );
  };
  loadRequest = async () => {
    let { cacheLoaded, month, year } = this.state;

    try {
      let response = await Request.post(
        'pr/listagenda',
        {
          v_mes: month,
          v_anno: year
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
        this.setState({ isLoading: false, isRefreshing: false });
      }
    }
  };

  isToday = item => {
    let { month, year } = this.state;
    let day = parseInt(item.DIA1 || item.FECHAFINAL, 10);
    let date = `${day}/${month}/${year}`;
    return date === moment().format('DD/MM/YYYY');
  };
  renderItem = ({ item, index }) => {
    let isToday = this.isToday(item);
    return <AgendaItem isToday={isToday} agenda={item} />;
  };
  onRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.load();
    });
  };

  componentDidMount() {
    this.load();
  }

  render() {
    let { isLoading, isRefreshing, agendaList } = this.state;
    let paddingTop = DimensionUtil.getNavigationBarHeight();
    return (
      <View style={[styles.container, { paddingTop }]}>
        {/*<Background />*/}
        {isLoading && <Loading margin />}
        <FlatList
          ref={'list'}
          data={agendaList}
          showsVerticalScrollIndicator={true}
          getItemLayout={(data, index) => {
            let height = 145;
            return { length: height, offset: height * index, index };
          }}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.onRefresh}
            />
          }
          renderItem={this.renderItem}
          keyExtractor={(item, index) => {
            return index;
          }}
        />
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
