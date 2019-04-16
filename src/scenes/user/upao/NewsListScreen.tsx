import * as React from 'react';
import {
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { Color, Theme } from '../../../themes/styles';
import * as PropTypes from 'prop-types';
import Log from '../../../modules/logger/Log';
import NewsItem from '../../../components/news/NewsItem';
import Loading from '../../../components/ui/Loading';
import { _ } from '../../../modules/i18n/Translator';
import CacheStorage from '../../../modules/storage/CacheStorage';
import UPAO from '../../../scraping/UPAO';
import FlexibleGrid from '../../../components/ui/FlexibleGrid';
import { NewsModel } from '../../../scraping/info/News';
import {
  NavigationScreenProp,
  NavigationStackScreenOptions,
} from 'react-navigation';
import AlertMessage from '../../../components/ui/AlertMessage';

export interface NewsListScreenProps {
  navigation: NavigationScreenProp<any, any>;
}

export interface State {
  newsList: NewsModel[];
  page: number;
  cacheLoaded: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

const TAG = 'NewsListScreen';
export default class NewsListScreen extends React.Component<
  NewsListScreenProps,
  State
> {
  static contextTypes = {
    notification: PropTypes.object.isRequired,
  };

  static navigationOptions: NavigationStackScreenOptions = {
    title: _('Últimas noticias'),
    headerBackTitle: null,
    headerTitleStyle: [Theme.title, Theme.subtitle],
    headerTintColor: Color.tintColor,
    headerStyle: [
      Theme.navigationBar,
      Theme.subNavigationBar,
      Theme.shadowDefault,
    ],
  };

  state = {
    newsList: [],
    page: 1,
    cacheLoaded: false,
    isLoading: true,
    isRefreshing: false,
    isLoadingMore: false,
    canLoadMore: true,
  };

  load = async () => {
    const { page, isRefreshing, isLoadingMore } = this.state;

    if (!(isRefreshing || isLoadingMore)) {
      this.setState({ isLoading: true, cacheLoaded: false });
    }
    if (page === 1 && !isRefreshing) {
      await this.checkCache();
    }
    await this.loadRequest();
  };
  getCacheKey = () => {
    const { page } = this.state;
    return `newsList_${page}`;
  };
  checkCache = async () => {
    const { page } = this.state;

    try {
      const data = await CacheStorage.get(this.getCacheKey());
      data && this.loadResponse(data, true);
    } catch (e) {
      Log.info(TAG, 'checkCache', e);
    }
  };

  loadResponse = (data: NewsModel[], cacheLoaded = false) => {
    const { page } = this.state;
    let newsList: NewsModel[] = [];

    if (data.length < 1) {
      this.setState({ canLoadMore: false });
    }
    if (page === 1) {
      newsList = data;
    } else {
      newsList = [...this.state.newsList, ...data];
    }

    this.setState({
      cacheLoaded,
      newsList,
      isLoading: false,
      isRefreshing: false,
      isLoadingMore: false,
    });
  };
  loadRequest = async () => {
    const { cacheLoaded, page } = this.state;

    try {
      const items = await UPAO.Info.News.getList(page);
      this.loadResponse(items);
      CacheStorage.set(this.getCacheKey(), items);
    } catch (e) {
      Log.warn(TAG, 'load', e);
      if (!cacheLoaded) {
        this.loadResponse([]);
      } else {
        this.setState({
          isLoading: false,
          isRefreshing: false,
          isLoadingMore: false,
        });
      }
    }
  };
  renderItem = ({ item, index }: ListRenderItemInfo<NewsModel>) => {
    return <NewsItem news={item} />;
  };
  onRefresh = () => {
    this.setState({ isRefreshing: true, page: 1 }, () => {
      this.load();
    });
  };
  loadNext = () => {
    const page = this.state.page + 1;
    this.setState({ isLoadingMore: true, page }, () => {
      this.load();
    });
  };
  onEndReached = () => {
    const { isLoadingMore, canLoadMore, isLoading } = this.state;
    if (!canLoadMore || isLoadingMore || isLoading) {
      return;
    }
    this.loadNext();
  };

  componentWillUnmount() {
    UPAO.abort('News.getList');
  }

  componentDidMount() {
    this.load();
  }

  render() {
    const { isLoading, isRefreshing, newsList } = this.state;
    return (
      <View style={[styles.container]}>
        {!isLoading && newsList.length < 1 && (
          <AlertMessage type={'warning'} title={_('No se encontraron datos')} />
        )}
        {isLoading && <Loading margin />}
        <FlexibleGrid
          itemWidth={250}
          itemMargin={0}
          data={newsList}
          scrollEnabled={true}
          showsVerticalScrollIndicator={true}
          renderItem={this.renderItem}
          onEndReached={this.onEndReached}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.onRefresh}
            />
          }
          keyExtractor={(item: NewsModel, index) => {
            return item.id;
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
});
