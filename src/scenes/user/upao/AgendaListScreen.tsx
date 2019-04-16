import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Color, Theme } from '../../../themes/styles';
import * as PropTypes from 'prop-types';
import Log from '../../../modules/logger/Log';
import Loading from '../../../components/ui/Loading';
import AgendaItem from '../../../components/agenda/AgendaItem';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';
import { AgendaModel } from '../../../scraping/info/Agenda';
import AlertMessage from '../../../components/ui/AlertMessage';

const moment = require('moment');

export interface AgendaListScreenProps {
  navigation: NavigationScreenProp<any, any>;
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
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Agenda del més'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
    ],
  };

  refs: any;
  state: State = {
    agendaList: [],
    month: moment().format('MM'),
    year: moment().format('YYYY'),
    isRefreshing: false,
    cacheLoaded: false,
    isLoading: true,
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
    const { month, year } = this.state;
    return `agendaList_${month}_${year}`;
  };
  checkCache = async () => {
    try {
      const data = await CacheStorage.get(this.getCacheKey());
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
      for (const item of data) {
        const isToday = this.isToday(item);
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
              viewPosition: 0.5,
            });
        }, 1000);
      }
    );
  };
  loadRequest = async () => {
    const { cacheLoaded, month, year } = this.state;

    try {
      const items = await UPAO.Info.Agenda.getList(1);
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
    const { month, year } = this.state;
    const day = item.dayOfMonth;
    const date = `${day}/${month}/${year}`;
    return date === moment().format('DD/MM/YYYY');
  };
  renderItem = ({ item, index }: ListRenderItemInfo<AgendaModel>) => {
    const isToday = this.isToday(item);
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
    const { isLoading, isRefreshing, agendaList } = this.state;
    return (
      <View style={[styles.container]}>
        {!isLoading && agendaList.length < 1 && (
          <AlertMessage type={'warning'} title={_('No se encontraron datos')} />
        )}
        {isLoading && <Loading margin />}
        <FlatList
          ref={'list'}
          data={agendaList}
          showsVerticalScrollIndicator={true}
          getItemLayout={(data, index) => {
            const height = 145;
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
    backgroundColor: '#fff',
  },
});
