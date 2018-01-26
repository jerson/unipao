import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';
import { Theme } from '../../../themes/styles';
import * as PropTypes from 'prop-types';
import Log from '../../../modules/logger/Log';
import Loading from '../../../components/ui/Loading';
import AgendaItem from '../../../components/agenda/AgendaItem';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions
} from 'react-navigation';
import { AgendaModel } from '../../../scraping/info/Agenda';

const moment = require('moment');

export interface AgendaListScreenProps {
  navigation: NavigationScreenProp<null, null>;
}

export interface State {
  agendaList: AgendaModel[];
  month: string;
  year: string;
  isRefreshing: boolean;
  cacheLoaded: boolean;
  isLoading: boolean;
}

const TAG = 'AgendaListScreen';
export default class AgendaListScreen extends React.Component<
  AgendaListScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired
  };

  static navigationOptions: NavigationStackScreenOptions = {
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

  refs: {
    [string: string]: any;
    input: FlatList<AgendaModel>;
  };
  state: State = {
    agendaList: [],
    month: moment().format('MM'),
    year: moment().format('YYYY'),
    isRefreshing: false,
    cacheLoaded: false,
    isLoading: false
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

  loadResponse = (data: AgendaModel[], cacheLoaded = false) => {
    let exist = false;
    let i = 0;
    if (data) {
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
      let items = await UPAO.Info.Agenda.getList(1);
      this.loadResponse(items);
      CacheStorage.set(this.getCacheKey(), items);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse([]);
      } else {
        this.setState({ isLoading: false, isRefreshing: false });
      }
    }
  };
  isToday = (item: AgendaModel) => {
    let { month, year } = this.state;
    let day = item.dayOfMonth;
    let date = `${day}/${month}/${year}`;
    return date === moment().format('DD/MM/YYYY');
  };
  renderItem = ({ item, index }: ListRenderItemInfo<AgendaModel>) => {
    let isToday = this.isToday(item);
    return <AgendaItem isToday={isToday} agenda={item} />;
  };
  onRefresh = () => {
    this.setState({ isRefreshing: true }, () => {
      this.load();
    });
  };

  componentWillUnmount() {
    UPAO.abort('Agenda.getList');
  }

  componentDidMount() {
    this.load();
  }

  render() {
    let { isLoading, isRefreshing, agendaList } = this.state;
    return (
      <View style={[styles.container]}>
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
            return index.toString();
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
